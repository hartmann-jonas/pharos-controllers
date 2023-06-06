import {
	AuthResponse,
	LogoutResponse,
	ControlResponse,
	ControlSpaceOptions,
	ControlSceneOptions,
	SpaceResponse,
} from './interfaces'
/**
 * Class to define the PharosClient
 * @author Jonas Hartmann
 */
export declare class ExpertClient {
	private host
	private token
	private pollTime
	private poll_interval
	poll(): Promise<void>
	constructor(host: string)
	/**
	 * Authenticate the client with the Pharos controller using the provided username and password.
	 * @param host The IP address of the controller.
	 * @param username The username for authentication.
	 * @param password The password for authentication.
	 */
	authenticate(username: string, password: string): Promise<AuthResponse>
	/**
	 * Logout the client.
	 */
	logout(): Promise<LogoutResponse>
	/**
	 * Get information about the fixture groups in the project.
	 * @param spaceNumbers Optional. The group numbers to filter the results.
	 * @returns The response data containing the fixture groups.
	 */
	getSpaces(spaceNumbers?: string): Promise<SpaceResponse>
	/**
	 * Control a group in the project.
	 * @param action The action to perform on the group.
	 * @param options Additional options for controlling the group.
	 * @returns The response data from the control group request.
	 */
	controlSpace(action: 'master_intensity', options: ControlSpaceOptions): Promise<ControlResponse>
	/**
	 * Control a scene in the project.
	 * Action will propagate to all controllers in a project.
	 * @param action start, release or toggle
	 * @param options num: integer (Number of scene is REQUIRED) fade: number (Optional Fade Time)
	 */
	controlScene(action: 'start' | 'release' | 'toggle', options: ControlSceneOptions): Promise<ControlResponse>
}
