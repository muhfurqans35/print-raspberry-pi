package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"strconv"
)

type PrintRequest struct {
	PrinterName string `json:"printer_name"`
	FilePath    string `json:"file_path"`
	Copies      int    `json:"copies"`
	PaperSize   string `json:"paper_size"`
	Orientation string `json:"orientation"`
	ColorMode   string `json:"color_mode"`
}

func PrintHandler(w http.ResponseWriter, r *http.Request) {
	var request PrintRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Log data yang diterima
	log.Printf("Received print request: %+v", request)

	// Ambil path relatif dari file yang akan diunduh
	relativePath := request.FilePath
	// Encode path untuk query string URL
	encodedPath := url.QueryEscape(relativePath)

	// URL untuk mengunduh file
	fileURL := fmt.Sprintf("http://192.168.1.18:8000/api/download?path=%s", encodedPath)

	// Menyimpan file sementara di Raspberry Pi
	tempFilePath := "/tmp/print_temp.pdf"

	// Download file menggunakan http.Get
	err := downloadFile(fileURL, tempFilePath)
	if err != nil {
		http.Error(w, "Failed to download file: "+err.Error(), http.StatusInternalServerError)
		log.Printf("Failed to download file: %v", err)
		return
	}

	// Setelah file berhasil disimpan, kirimkan ke printer
	printFile(tempFilePath, request)
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

func printFile(filePath string, request PrintRequest) {
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

	// Jalankan perintah `lp` dengan argumen yang disiapkan
	err := exec.Command(command[0], command[1:]...).Run()
	if err != nil {
		log.Printf("Printing failed: %v", err)
	}
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
