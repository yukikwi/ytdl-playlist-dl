export interface YoutubePlaylistInterface {
    getPlId(): String
    getItem(): Promise<Array<Object>>
    getPlaylistTitle(): Promise<String>
}