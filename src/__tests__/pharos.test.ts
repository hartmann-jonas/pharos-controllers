import { DesignerClient } from '../'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

test('Full Test', async () => {
	const controller = new DesignerClient('192.168.178.149')

	await controller.authenticate('admin', 'pharos')

	const timelines = await controller.getTimelines()
	console.log(timelines.success)
	await controller.getGroups()
	await controller.getScenes()

	sleep(2000)

	await controller.controlTimeline('start', { num: 7 })
	await controller.controlGroup('master_intensity', { num: 2, level: 100 })
	await controller.controlScene('release', { num: 4 })

	await controller.logout()
}, 600000)

test('Login Fail', async () => {
	const controller = new DesignerClient('192.168.178.149')

	await controller.authenticate('admin', 'admin')

	await controller.logout()
})

test('No auth', async () => {
	const controller = new DesignerClient('192.168.178.149')
	await controller.controlTimeline('start', { num: 7 })
})