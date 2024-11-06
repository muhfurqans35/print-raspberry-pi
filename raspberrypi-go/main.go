package main

import (
    "encoding/json"
    "net/http"
    "os/exec"
    "strconv"
    "log"
)

type PrintRequest struct {
    File       string `json:"file"`
    PaperSize  string `json:"paper_size"`
    ColorMode  string `json:"color_mode"`
    Orientation string `json:"orientation"`
    Copies     int    `json:"copies"`
}

// Handler untuk endpoint /print
func printHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    var req PrintRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    filepath := "./uploads/" + req.File

    // Membangun perintah CUPS
    command := []string{
        "lp",
        "-d", "EPSON_L3250_Series",
        "-o", "media=" + req.PaperSize,
        "-o", "color_mode=" + req.ColorMode,
        "-o", "orientation-requested=" + orientationToCUPS(req.Orientation),
        "-n", strconv.Itoa(req.Copies),
        filepath, // gunakan filepath di sini
    }

    // Menjalankan perintah
    if err := exec.Command(command[0], command[1:]...).Run(); err != nil {
        http.Error(w, "Failed to print: "+err.Error(), http.StatusInternalServerError)
        return
    }

    // Respon sukses
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Print request received"))
}

// Fungsi untuk mengonversi orientasi ke CUPS
func orientationToCUPS(orientation string) string {
    if orientation == "portrait" {
        return "3" // 3 untuk portrait
    }
    return "4" // 4 untuk landscape
}

func main() {
    http.HandleFunc("/print", printHandler)
    log.Println("Starting server on :8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatal(err)
    }
}
