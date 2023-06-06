# pharos-controllers

Library written in TypeScript to control Pharos Lighting controllers via the HTTP rest API.

## Available commands

- authenticate()
- logout()

### ONLY DESIGNER
- getTimelines()
- getGroups()
- getScenes()
- controllTimeline()
- controlGroup()
- controlScene()

### ONLY EXPERT
- getSpaces()
- controlSpace()
- controlScene()

## Example Designer:

```js
import { DesignerClient } from 'pharos-controllers'

const controller = new DesignerClient('192.168.0.10')

async function example() {
	await controller.authenticate('admin', 'admin')
	// returns success true/false if false an error is returned as well

	const timelines = await controller.getTimelines()
	// returns success and all timelines

	const groups = await controller.getGroups('1-10')
	// returns success and groups 1 through 10

	await controller.controlTimeline('start', { num: 7 })
	// starts timeline number 7 and returns success true/false

	await controller.controlTimeline('release', { fade: 5 })
	// releases all timelines with a fade of 5 seconds

	await controller.controlTimeline('set_rate', { num: 3, rate: '0.5' })
	// sets the rate of timeline 3 to 50% of the default rate

	const logout = await controller.logout()
	// returns success true/false
}

example()
```

## Example Designer:

```js
import { ExpertClient } from 'pharos-controllers'

const controller = new ExpertClient('192.168.0.20')

async function example() {
	await controller.authenticate('admin', 'admin')
	// returns success true/false if false an error is returned as well

    await controller.getSpaces('1-3')
	// returns info about space 1 till 3

    await controller.controlScene('recall', { num: 5 })
	// recalls scene 5 and returns success true/false

    await controller.controlSpace('master_intensity', { num: 3, level: 82.3})

	await controller.logout()
	// returns success true/false
}
```