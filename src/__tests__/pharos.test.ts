import { DesignerClient } from '../'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const controllerIP = '192.168.1.100'
const USER = 'admin'
const PASS = 'LiAadmin'

test('Full Test', async () => {
	const controller = new DesignerClient(controllerIP)

	await controller.authenticate(USER, PASS)

	const timelines = await controller.getTimelines()
	console.log('Timelines: ' + timelines.success)
	const groups = await controller.getGroups()
	console.log('Groups: ' + groups.success)
	const scenes = await controller.getScenes()
	console.log('Scenes: ' + scenes.success)
	const triggers = await controller.getTriggers()
	console.log('Triggers: ' + triggers.success)

	sleep(360)

	await controller.controlTimeline('start', { num: 2 })
	await controller.controlGroup('master_intensity', { num: 2, level: 100 })
	await controller.controlScene('release', { num: 4 })
	await controller.controlTrigger('fire', { num: 1 })

	await controller.logout()
})

test('Login Fail', async () => {
	const controller = new DesignerClient(controllerIP)

	await controller.authenticate(USER, 'wrongpassword')

	await controller.logout()
})

test('No auth', async () => {
	const controller = new DesignerClient(controllerIP)
	await controller.controlTimeline('start', { num: 1 })
})

test('Invalid timeline', async () => {
	const controller = new DesignerClient(controllerIP)
	await controller.authenticate(USER, PASS)
	await controller.controlTimeline('start', { num: 9999 })
	await controller.logout()
})
