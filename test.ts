import PharosClient from "./src/client";

const pharosConfig = {
    host: 'http://127.0.0.1'
}

const pharosClient = new PharosClient(pharosConfig)

await pharosClient.authenticate('test', 'test')

async function exampleTest() {
    await pharosClient.controlTimeline('start', { num: 1 })
    await pharosClient.controlGroup('master_intensity', {})
    const groups = await pharosClient.getGroups()
    console.log(groups)
}

exampleTest()
