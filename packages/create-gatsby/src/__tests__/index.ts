import { questions, plugin } from "../"
import fs from "fs"
import Enquirer, { Prompt } from "enquirer"

jest.mock(`fs`)

async function stringInput(prompt: any, word: string): Promise<void> {
  for (const char of word) {
    await prompt.keypress(char)
  }
}

describe(`run`, () => {
  let enquirer

  beforeEach(() => {
    enquirer = new Enquirer<IAnswers>()
    enquirer.use(plugin)
    jest.setTimeout(10000)
  })

  it(`should not accept bad name`, async () => {
    enquirer.on(`prompt`, prompt => {
      prompt.once(`run`, async () => {
        if (prompt.name === `project`) {
          await stringInput(prompt, `bad/name`)
          await prompt.submit()
          await prompt.keypress(null, { name: `backspace` })
          await prompt.keypress(null, { name: `backspace` })
          await prompt.keypress(null, { name: `backspace` })
          await prompt.keypress(null, { name: `backspace` })
          await prompt.keypress(null, { name: `backspace` })
          await prompt.keypress(null, { name: `backspace` })
          await prompt.keypress(null, { name: `backspace` })
          await prompt.keypress(null, { name: `backspace` })
          await stringInput(prompt, `goodname`)
          await prompt.submit()
        } else if (prompt.name === `cms`) {
          await prompt.submit()
        } else if (prompt.name === `styling`) {
          await prompt.submit()
        } else if (prompt.name === `features`) {
          await prompt.keypress(null, { name: `tab` })
          await prompt.submit()
        }
      })
    })

    const data = await enquirer.prompt(questions)
    expect(data).toEqual({
      project: `goodname`,
      cms: `none`,
      styling: `none`,
      features: [],
    })
  })

  // fit('should not accept a name that exists', async () => {
  //   enquirer.on('prompt', prompt => {
  //     prompt.once('run', async () => {
  //       jest.spyOn(fs, 'existsSync')
  //       if (prompt.name === `project`) {
  //         ;((fs.existsSync as unknown) as jest.Mock<
  //         boolean,
  //         [string]
  //       >).mockReturnValueOnce(true)
  //         await stringInput(prompt, 'bad/name')
  //         await prompt.submit()
  //           ;((fs.existsSync as unknown) as jest.Mock<
  //           boolean,
  //           [string]
  //         >).mockReturnValueOnce(false)
  //         await prompt.keypress(null, {name: 'backspace'})
  //         await prompt.keypress(null, {name: 'backspace'})
  //         await prompt.keypress(null, {name: 'backspace'})
  //         await prompt.keypress(null, {name: 'backspace'})
  //         await prompt.keypress(null, {name: 'backspace'})
  //         await prompt.keypress(null, {name: 'backspace'})
  //         await prompt.keypress(null, {name: 'backspace'})
  //         await prompt.keypress(null, {name: 'backspace'})
  //         await stringInput(prompt, 'newname')
  //         await prompt.submit()
  //       } else if (prompt.name === `cms`) {
  //         await prompt.submit()
  //       } else if (prompt.name === `styling`) {
  //         await prompt.submit()
  //       } else if (prompt.name === `features`) {
  //         await prompt.keypress(null, { name: `tab` })
  //         await prompt.submit()
  //       }
  //     })
  //   })

  //   const data = await enquirer.prompt(questions)
  //   expect(data).toEqual({
  //     project: 'newname',
  //     cms: 'none',
  //     styling: 'none',
  //     features: []
  //   })
  // })

  it(`should take project name`, async () => {
    enquirer.on(`prompt`, prompt => {
      prompt.once(`run`, async () => {
        if (prompt.name === `project`) {
          await stringInput(prompt, `my-new-site`)
          await prompt.submit()
        } else if (prompt.name === `cms`) {
          await prompt.submit()
        } else if (prompt.name === `styling`) {
          await prompt.submit()
        } else if (prompt.name === `features`) {
          await prompt.keypress(null, { name: `tab` })
          await prompt.submit()
        }
      })
    })

    const data = await enquirer.prompt(questions)
    expect(data).toEqual({
      cms: `none`,
      features: [],
      project: `my-new-site`,
      styling: `none`,
    })
  })

  it(`can select a CMS`, async () => {
    enquirer.on(`prompt`, prompt => {
      prompt.once(`run`, async () => {
        if (prompt.name === `project`) {
          await stringInput(prompt, `select-cms`)
          await prompt.submit()
        } else if (prompt.name === `cms`) {
          await prompt.keypress(null, { name: `down` })
          await prompt.keypress(null, { name: `down` })
          await prompt.submit()
        } else if (prompt.name === `styling`) {
          await prompt.submit()
        } else if (prompt.name === `features`) {
          await prompt.keypress(null, { name: `tab` })
          await prompt.submit()
        }
      })
    })

    const data = await enquirer.prompt(questions)
    expect(data).toEqual({
      project: `select-cms`,
      cms: `gatsby-source-contentful`,
      styling: `none`,
      features: [],
    })
  })

  it(`can select a styling library`, async () => {
    enquirer.on(`prompt`, prompt => {
      prompt.once(`run`, async () => {
        if (prompt.name === `project`) {
          await stringInput(prompt, `select-styling`)
          await prompt.submit()
        } else if (prompt.name === `cms`) {
          await prompt.submit()
        } else if (prompt.name === `styling`) {
          await prompt.keypress(null, { name: `down` })
          await prompt.submit()
        } else if (prompt.name === `features`) {
          await prompt.keypress(null, { name: `tab` })
          await prompt.submit()
        }
      })
    })

    const data = await enquirer.prompt(questions)
    expect(data).toEqual({
      project: `select-styling`,
      cms: `none`,
      styling: `gatsby-plugin-postcss`,
      features: [],
    })
  })

  it(`can select additional plugins`, async () => {
    enquirer.on(`prompt`, prompt => {
      prompt.once(`run`, async () => {
        if (prompt.name === `project`) {
          await stringInput(prompt, `more-features`)
          await prompt.submit()
        } else if (prompt.name === `cms`) {
          await prompt.submit()
        } else if (prompt.name === `styling`) {
          await prompt.submit()
        } else if (prompt.name === `features`) {
          await prompt.keypress(null, { name: `down` })
          await prompt.keypress(null, { name: `space` })
          await prompt.keypress(null, { name: `down` })
          await prompt.keypress(null, { name: `down` })
          await prompt.keypress(null, { name: `space` })
          await prompt.keypress(null, { name: `tab` })
          await prompt.submit()
        }
      })
    })

    const data = await enquirer.prompt(questions)
    expect(data).toEqual({
      project: `more-features`,
      cms: `none`,
      styling: `none`,
      features: [`gatsby-plugin-react-helmet`, `gatsby-plugin-offline`],
    })
  })
})