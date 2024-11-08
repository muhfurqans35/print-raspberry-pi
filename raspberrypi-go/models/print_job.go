package models

// "errors"

// Struktur untuk data Print Job
type PrintJob struct {
	PrintJobID  int    `json:"print_job_id"`
	File        string `json:"file"`
	Copies      int    `json:"copies"`
	Orientation string `json:"orientation"`
	PaperSize   string `json:"paper_size"`
	ColorMode   string `json:"color_mode"`
}

// // // Simulasi database atau sumber data untuk print job
// // var printJobs = []PrintJob{
// // 	{PrintJobID: 1, File: "document1.pdf", Copies: 2, Orientation: "portrait", PaperSize: "A4", ColorMode: "Color"},
// // 	{PrintJobID: 2, File: "document2.pdf", Copies: 1, Orientation: "landscape", PaperSize: "A3", ColorMode: "Grayscale"},
// // }

// // Fungsi untuk mengambil data print job berdasarkan ID
// func GetPrintJobByID(printJobID int) (*PrintJob, error) {
// 	for _, job := range printJobs {
// 		if job.PrintJobID == printJobID {
// 			return &job, nil
// 		}
// 	}
// 	return nil, errors.New("print job not found")
// }
