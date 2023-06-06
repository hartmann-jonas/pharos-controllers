interface PharosConfig {
	host: string
}
interface ControlTimelineOptions {
	num?: number
	fade?: number
	group?: string
	rate?: string
	position?: string
}
interface ControlGroupOptions {
	num?: number
	level?: number | string
	fade?: number
	delay?: number
}
interface ControlSceneOptions {
	num: number
	fade?: number
	group?: string
}
interface Scene {
	num: number
	name: string
	state: string
	onstage: boolean
}
/**
 * Class to define the PharosClient
 * @author Jonas Hartmann
 */
declare class PharosClient {
	private host
	private token
	constructor(config: PharosConfig)
	/**
	 * Authenticate the client with the Pharos controller using the provided username and password.
	 * @param username The username for authentication.
	 * @param password The password for authentication.
	 */
	authenticate(username: string, password: string): Promise<string | null>
	/**
	 * Control the timeline of the project.
	 * @param action The action to perform on the timeline.
	 * @param options Additional options for controlling the timeline.
	 * @returns The response data from the control timeline request.
	 */
	controlTimeline(action: string, options: ControlTimelineOptions): Promise<any>
	/**
	 * Get information about the fixture groups in the project.
	 * @param groupNumbers Optional. The group numbers to filter the results.
	 * @returns The response data containing the fixture groups.
	 */
	getGroups(groupNumbers?: string): Promise<any>
	/**
	 * Control a group in the project.
	 * @param action The action to perform on the group.
	 * @param options Additional options for controlling the group.
	 * @returns The response data from the control group request.
	 */
	controlGroup(action: string, options: ControlGroupOptions): Promise<any>
	/**
	 * Control a scene in the project.
	 * Action will propagate to all controllers in a project.
	 * @param action start, release or toggle
	 * @param options num: integer (Number of scene is REQUIRED) fade: number (Optional Fade Time)
	 */
	controlScene(action: string, options: ControlSceneOptions): Promise<void>
	/**
	 * Get information about the scenes in the project and their state on the controller.
	 * @param num Optional. The scene numbers to filter the results.
	 * @returns An array of Scene objects representing the scenes and their states.
	 */
	getScenes(num?: string): Promise<Scene[]>
}
export default PharosClient
