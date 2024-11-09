package models

type PrintRequest struct {
	PrinterName string `json:"printer_name"`
	FilePath    string `json:"file_path"`
	Copies      int    `json:"copies"`
	PaperSize   string `json:"paper_size"`
	Orientation string `json:"orientation"`
	ColorMode   string `json:"color_mode"`
}
