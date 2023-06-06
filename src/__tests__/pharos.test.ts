import { PharosClient } from '..'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

test('Full Test', async () => {
	const controller = new PharosClient()

	await controller.authenticate('192.168.178.149', 'admin', 'pharos')

	const timelines = await controller.getTimelines()
	await controller.getGroups()
	await controller.getScenes()

	//sleep(300000)

	await controller.controlTimeline('start', { num: 7 })
	await controller.controlGroup('master_intensity', { num: 2, level: 100 })
	await controller.controlScene('release', { num: 4 })

	await controller.logout()
}, 600000)

test('Fail Test', async () => {
	const controller = new PharosClient()

	await controller.authenticate('http://192.168.178.149', 'admin', 'pharos')
})
