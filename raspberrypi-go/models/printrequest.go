package models


type PrintRequest struct {
    File       string `json:"file"`
    PaperSize  string `json:"paper_size"`
    ColorMode  string `json:"color_mode"`
    Orientation string `json:"orientation"`
    Copies     int    `json:"copies"`
}
