import { AuthResponse, LogoutResponse, ControlResponse, ControlTimelineOptions, ControlGroupOptions, ControlSceneOptions, TimelineResponse, SceneResponse, GroupResponse } from './interfaces';
/**
 * Class to define the PharosClient
 * @author Jonas Hartmann
 */
declare class PharosClient {
    private host;
    private token;
    private pollTime;
    private poll_interval;
    poll(): Promise<void>;
    constructor();
    /**
     * Authenticate the client with the Pharos controller using the provided username and password.
     * @param host The IP address of the controller.
     * @param username The username for authentication.
     * @param password The password for authentication.
     */
    authenticate(host: string, username: string, password: string): Promise<AuthResponse>;
    /**
     * Logout the client.
     */
    logout(): Promise<LogoutResponse>;
    /**
     * Get information about the timelines in the project.
     * @param timelineNumbers Optional. The timeline numbers to filter the results.
     * @returns An array containing the timeline objects.
     */
    getTimelines(timelineNumbers?: string): Promise<TimelineResponse>;
    /**
     * Control the timeline of the project.
     * @param action The action to perform on the timeline.
     * @param options Additional options for controlling the timeline.
     * @returns The response data from the control timeline request.
     */
    controlTimeline(action: 'start' | 'release' | 'toggle' | 'pause' | 'resume' | 'set_rate' | 'set_position', options: ControlTimelineOptions): Promise<ControlResponse>;
    /**
     * Get information about the fixture groups in the project.
     * @param groupNumbers Optional. The group numbers to filter the results.
     * @returns The response data containing the fixture groups.
     */
    getGroups(groupNumbers?: string): Promise<GroupResponse>;
    /**
     * Control a group in the project.
     * @param action The action to perform on the group.
     * @param options Additional options for controlling the group.
     * @returns The response data from the control group request.
     */
    controlGroup(action: 'master_intensity', options: ControlGroupOptions): Promise<ControlResponse>;
    /**
     * Control a scene in the project.
     * Action will propagate to all controllers in a project.
     * @param action start, release or toggle
     * @param options num: integer (Number of scene is REQUIRED) fade: number (Optional Fade Time)
     */
    controlScene(action: 'start' | 'release' | 'toggle', options: ControlSceneOptions): Promise<ControlResponse>;
    /**
     * Get information about the scenes in the project and their state on the controller.
     * @param num Optional. The scene numbers to filter the results.
     * @returns An array of Scene objects representing the scenes and their states.
     */
    getScenes(sceneNumbers?: string): Promise<SceneResponse>;
}
export default PharosClient;
