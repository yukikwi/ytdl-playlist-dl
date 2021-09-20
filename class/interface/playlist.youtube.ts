export interface YoutubePlaylistInterface {
    getPlId(): String
    getItem(): Promise<Array<Object>>
}