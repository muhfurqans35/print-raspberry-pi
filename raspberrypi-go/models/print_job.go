package models

import "errors"

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

var printJobs = []PrintJob{
	{PrintJobID: 9999, File: "document1.pdf", Copies: 2, Orientation: "portrait", PaperSize: "A4", ColorMode: "Color"},
}

// Fungsi untuk mengambil data print job berdasarkan ID
func GetPrintJobByID(printJobID int) (*PrintJob, error) {
	for _, job := range printJobs {
		if job.PrintJobID == printJobID {
			return &job, nil
		}
	}
	return nil, errors.New("print job not found")
}
