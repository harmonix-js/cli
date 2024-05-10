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
  async run(context) {
    let { type, name } = context.args
    const types = ['command', 'event']

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
          "  description: 'Description here',\n" +
          '  args: [\n' +
          '    // Arguments here\n' +
          '  ],\n' +
          '}, () => {\n' +
          '  // Code here\n' +
          '})'
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
          '})'
      )
    }
    consola.success(`✨ ${type} ${name} has been created.`)
  }
})
