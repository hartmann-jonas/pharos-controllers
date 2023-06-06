# pharos-designer

Library written in TypeScript to control Pharos Designer Lighting controllers via the HTTP rest API.

## Available commands
* authenticate()
* logout()
* getTimelines()
* getGroups()
* getScenes()

Controls:  
* controllTimeline()
* controlGroup()
* controlScene()

## Examples:
```js
import PharosClient from 'pharos-js';

const controller = new PharosClient()

async function example() {
    await controller.authenticate('192.168.0.10', 'admin', 'admin')
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
