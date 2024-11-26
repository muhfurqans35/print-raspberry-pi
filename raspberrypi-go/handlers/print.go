package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"strconv"
	"time"
)

type PrintRequest struct {
	PrinterName string `json:"printer_name"`
	FilePath    string `json:"file_path"`
	Copies      int    `json:"copies"`
	PaperSize   string `json:"paper_size"`
	Orientation string `json:"orientation"`
	ColorMode   string `json:"color_mode"`
}

type PrintResponse struct {
	Message string `json:"message"`
	Status  string `json:"status"`
}

func PrintHandler(w http.ResponseWriter, r *http.Request) {
	var request PrintRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Log data yang diterima
	log.Printf("Received print request: %+v", request)

	// Segera kirim response success ke Laravel
	response := PrintResponse{
		Message: "Print job received and queued for processing",
		Status:  "queued",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error sending response: %v", err)
		return
	}

	// Flush response buffer
	if f, ok := w.(http.Flusher); ok {
		f.Flush()
	}

	// Jalankan proses print di background
	go processPrintJob(request)
}

func processPrintJob(request PrintRequest) {
	// Ambil path relatif dari file yang akan diunduh
	relativePath := request.FilePath
	encodedPath := url.QueryEscape(relativePath)

	// URL untuk mengunduh file
	fileURL := fmt.Sprintf("http://192.168.1.18:8000/api/download?path=%s", encodedPath)

	// Menyimpan file sementara di Raspberry Pi
	tempFilePath := fmt.Sprintf("/tmp/print_%d.pdf", time.Now().UnixNano())

	// Download file
	if err := downloadFile(fileURL, tempFilePath); err != nil {
		log.Printf("Failed to download file: %v", err)
		return
	}

	// Kirim ke printer
	if err := printFile(tempFilePath, request); err != nil {
		log.Printf("Print failed: %v", err)
	} else {
		log.Println("Printing completed successfully")
	}

	// Hapus file temporary
	os.Remove(tempFilePath)
}

func printFile(filePath string, request PrintRequest) error {
	// Membangun perintah untuk mengirimkan pekerjaan ke printer
	command := []string{
		"lp",
		"-d", request.PrinterName,
		"-o", "media=" + request.PaperSize,
		"-o", "color_mode=" + colormode(request.ColorMode),
		"-o", "orientation-requested=" + orientationToCUPS(request.Orientation),
		"-n", strconv.Itoa(request.Copies),
		filePath,
	}

	// Jalankan perintah lp dengan timeout
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Minute) // Timeout 60 menit
	defer cancel()

	// Jalankan perintah lp dengan context
	cmd := exec.CommandContext(ctx, command[0], command[1:]...)

	// Jalankan perintah lp dan tunggu hingga selesai
	err := cmd.Run()
	if err != nil {
		// Jika terjadi error karena timeout atau lainnya
		if ctx.Err() == context.DeadlineExceeded {
			log.Printf("Printing process timed out")
			return fmt.Errorf("printing process timed out")
		} else {
			log.Printf("Printing failed: %v", err)
			return fmt.Errorf("printing failed: %v", err)
		}
	}

	return nil
}

func downloadFile(fileURL string, destinationPath string) error {
	// Buat HTTP GET request
	resp, err := http.Get(fileURL)
	if err != nil {
		return fmt.Errorf("failed to make HTTP request: %v", err)
	}
	defer resp.Body.Close()

	// Periksa status code response
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("bad status: %s", resp.Status)
	}

	// Buat file temporary
	out, err := os.Create(destinationPath)
	if err != nil {
		return fmt.Errorf("failed to create file: %v", err)
	}
	defer out.Close()

	// Copy isi response ke file
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return fmt.Errorf("failed to write file: %v", err)
	}

	return nil
}

func orientationToCUPS(orientation string) string {
	if orientation == "portrait" {
		return "3"
	}
	return "4"
}

func colormode(color string) string {
	if color == "black_white" {
		return "monochrome"
	}
	return "color"
}
