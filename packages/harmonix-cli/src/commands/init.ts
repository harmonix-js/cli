import { defineCommand } from 'citty'
import { downloadTemplate, DownloadTemplateResult } from 'giget'
import { SelectPromptOptions } from 'consola'
import { installDependencies, type PackageManagerName } from 'nypm'
import { hasTTY } from 'std-env'
import { harmonixIcon, themeColor } from '../utils/ascii'
import { logger } from '../utils/logger'
import { colors } from 'consola/utils'
import { resolve, relative } from 'pathe'
import { x } from 'tinyexec'

const pms: Record<PackageManagerName, undefined> = {
  npm: undefined,
  pnpm: undefined,
  yarn: undefined,
  bun: undefined,
  deno: undefined
}

const packageManagerOptions = Object.keys(pms) as PackageManagerName[]

export default defineCommand({
  meta: {
    name: 'init',
    description: 'Initialize a new Harmonix project'
  },
  args: {
    cwd: {
      type: 'string',
      description: 'Specify the working directory',
      valueHint: 'directory',
      default: '.'
    },
    dir: {
      type: 'positional',
      description: 'Project directory',
      default: 'harmonix-bot'
    },
    install: {
      type: 'boolean',
      default: true,
      description: 'Skip installing dependencies'
    },
    gitInit: {
      type: 'boolean',
      description: 'Initialize git repository'
    },
    packageManager: {
      type: 'string',
      description: 'Package manager choice (npm, pnpm, yarn, bun)'
    }
  },
  async run(ctx) {
    if (hasTTY) {
      process.stdout.write(`\n${harmonixIcon}\n\n`)
    }

    logger.info(
      colors.bold(
        `Welcome to Harmonix!`
          .split('')
          .map((m) => `${themeColor}${m}`)
          .join('')
      )
    )

    if (ctx.args.dir === '') {
      ctx.args.dir = await logger
        .prompt('Where would you like to create your project?', {
          placeholder: './harmonix-bot',
          type: 'text',
          default: 'harmonix-bot',
          cancel: 'reject'
        })
        .catch(() => process.exit(1))
    }

    const cwd = resolve(ctx.args.cwd)
    const templateDownloadPath = resolve(cwd, ctx.args.dir)

    logger.info(
      `Creating a new project in ${colors.cyan(relative(cwd, templateDownloadPath) || templateDownloadPath)}.`
    )

    let template: DownloadTemplateResult

    try {
      template = await downloadTemplate('github:harmonix-js/starter', {
        dir: templateDownloadPath
      })
    } catch (err) {
      if (process.env.DEBUG) throw err

      logger.error((err as Error).toString())
      process.exit(1)
    }

    const detectCurrentPackageManager = () => {
      const userAgent = process.env.npm_config_user_agent

      if (!userAgent) return
      const [name] = userAgent.split('/')

      if (packageManagerOptions.includes(name as PackageManagerName)) {
        return name as PackageManagerName
      }
    }

    const currentPackageManager = detectCurrentPackageManager()
    const packageManagerArg = ctx.args.packageManager as PackageManagerName
    const packageManagerSelectOptions = packageManagerOptions.map(
      (pm) =>
        ({
          label: pm,
          value: pm,
          hint: currentPackageManager === pm ? 'current' : undefined
        }) satisfies SelectPromptOptions['options'][number]
    )
    const selectedPackageManager = packageManagerOptions.includes(
      packageManagerArg
    )
      ? packageManagerArg
      : await logger
          .prompt('Which package manager would you like to use?', {
            type: 'select',
            options: packageManagerSelectOptions,
            initial: currentPackageManager,
            cancel: 'reject'
          })
          .catch(() => process.exit(1))

    if (!ctx.args.install) {
      logger.info('Skipping install dependencies step.')
    } else {
      logger.start('Installing dependencies...')

      try {
        await installDependencies({
          cwd: template.dir,
          packageManager: {
            name: selectedPackageManager,
            command: selectedPackageManager
          }
        })
      } catch (err) {
        if (process.env.DEBUG) throw err

        logger.error((err as Error).toString())
        process.exit(1)
      }

      logger.success('Installation completed.')
    }

    if (ctx.args.gitInit === undefined) {
      ctx.args.gitInit = await logger
        .prompt('Initialize a git repository?', {
          type: 'confirm',
          cancel: 'reject'
        })
        .catch(() => process.exit(1))
    }

    if (ctx.args.gitInit) {
      logger.info('Initializing git repository...\n')

      try {
        await x('git', ['init', template.dir], {
          throwOnError: true,
          nodeOptions: { stdio: 'inherit' }
        })
      } catch (err) {
        logger.warn(`Failed to initialize git repository: ${err}`)
      }
    }

    logger.log(`\n✨ Harmonix project has been created. Next steps:`)
    const relativeTemplateDir = relative(process.cwd(), template.dir) || '.'
    const runCmd = selectedPackageManager === 'deno' ? 'task' : 'run'
    const nextSteps = [
      relativeTemplateDir.length > 1 && `\`cd ${relativeTemplateDir}\``,
      `Start development bot with \`${selectedPackageManager} ${runCmd} dev\``
    ].filter(Boolean)

    for (const step of nextSteps) {
      logger.log(` › ${step}`)
    }
  }
})
