import { defineCommand } from 'citty'
import { consola } from 'consola'
import fs from 'node:fs'

export default defineCommand({
  meta: {
    name: 'add',
    description: 'Add a new command or event to the project'
  },
  args: {
    type: {
      type: 'positional',
      description: 'Type of the file to be created (command or event)'
    },
    name: {
      type: 'positional',
      description: 'Name of the file to be created'
    }
  },
  async run(ctx) {
    let { type, name } = ctx.args
    const types = [
      'command',
      'event',
      'context-menu',
      'button',
      'modal',
      'select-menu',
      'precondition'
    ]

    name = name.replace(/(\.ts)$/g, '')
    if (!types.includes(type)) {
      consola.error('Invalid type')
      process.exit(1)
    }
    if (!fs.existsSync(`./${type}s`)) {
      fs.mkdirSync(`./${type}s`)
    }
    if (type === 'command') {
      const category = await consola.prompt(
        'In which category would you like to place this command?',
        {
          placeholder: 'utils',
          type: 'text',
          required: true
        }
      )
      const filePath = `./${type}s/${category}/${name}.ts`

      if (!category) {
        consola.error('Category is required')
        process.exit(1)
      }
      if (fs.existsSync(filePath)) {
        consola.error('Command already exists')
        process.exit(1)
      }
      if (!fs.existsSync(`./${type}s/${category}`)) {
        fs.mkdirSync(`./${type}s/${category}`)
      }
      fs.writeFileSync(
        filePath,
        "import { defineCommand } from '@harmonix-js/core'\n\n" +
          'export default defineCommand({\n' +
          "  description: 'Description here'\n" +
          '}, () => {\n' +
          '  // Code here\n' +
          '})\n'
      )
    } else if (type === 'event') {
      const filePath = `./${type}s/${name}.ts`

      if (fs.existsSync(filePath)) {
        consola.error('Event already exists')
        process.exit(1)
      }
      fs.writeFileSync(
        filePath,
        "import { defineEvent } from '@harmonix-js/core'\n\n" +
          'export default defineEvent(() => {\n' +
          '  // Code here\n' +
          '})\n'
      )
    } else if (type === 'context-menu') {
      const filePath = `./${type}s/${name}.ts`

      if (fs.existsSync(filePath)) {
        consola.error('Context menu already exists')
        process.exit(1)
      }
      fs.writeFileSync(
        filePath,
        "import { defineContextMenu } from '@harmonix-js/core'\n\n" +
          'export default defineContextMenu((interaction) => {\n' +
          '  // Code here\n' +
          '})\n'
      )
    } else if (type === 'button') {
      const filePath = `./${type}s/${name}.ts`

      if (fs.existsSync(filePath)) {
        consola.error('Button already exists')
        process.exit(1)
      }
      fs.writeFileSync(
        filePath,
        "import { defineButton } from '@harmonix-js/core'\n\n" +
          "export default defineButton({ label: '' }, (interaction) => {\n" +
          '  // Code here\n' +
          '})\n'
      )
    } else if (type === 'modal') {
      const filePath = `./${type}s/${name}.ts`

      if (fs.existsSync(filePath)) {
        consola.error('Modal already exists')
        process.exit(1)
      }
      fs.writeFileSync(
        filePath,
        "import { defineModal } from '@harmonix-js/core'\n\n" +
          'export default defineModal(' +
          '  {\n' +
          "    title: 'Title here',\n" +
          '    inputs: {}\n' +
          '  },\n' +
          '  (interaction) => {\n' +
          '  // Code here\n' +
          '})\n'
      )
    } else if (type === 'select-menu') {
      const filePath = `./${type}s/${name}.ts`

      if (fs.existsSync(filePath)) {
        consola.error('Select menu already exists')
        process.exit(1)
      }
      fs.writeFileSync(
        filePath,
        "import { defineSelectMenu } from '@harmonix-js/core'\n\n" +
          'export default defineSelectMenu(\n' +
          '  {\n' +
          "    type: 'String',\n" +
          "    placeholder: 'Your placeholder',\n" +
          '    options: []\n' +
          '  },\n' +
          '  (interaction) => {\n' +
          '    // Code here\n' +
          '  }\n' +
          ')\n'
      )
    } else if (type === 'precondition') {
      const filePath = `./${type}s/${name}.ts`

      if (fs.existsSync(filePath)) {
        consola.error('Precondition already exists')
        process.exit(1)
      }
      fs.writeFileSync(
        filePath,
        "import { definePrecondition } from '@harmonix-js/core'\n\n" +
          'export default definePrecondition(({ interaction }) => {\n' +
          '  // Code here\n' +
          '})\n'
      )
    }

    consola.success(`✨ ${type} ${name} has been created.`)
  }
})
