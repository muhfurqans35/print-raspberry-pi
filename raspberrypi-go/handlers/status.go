package handlers

import (
	"bytes"
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"strings"
)

// Handler untuk menjalankan lpstat dan mengirimkan data ke Laravel
func printerStatusHandler(w http.ResponseWriter, r *http.Request) {
	statuses := getPrinterStatuses()

	for _, status := range statuses {
		err := sendToLaravel(status)
		if err != nil {
			log.Printf("Error sending to Laravel: %v", err)
		}
	}

	fmt.Fprintf(w, "Printer statuses processed and sent to Laravel")
}

// Menjalankan lpstat untuk mendapatkan status printer
func getPrinterStatuses() []map[string]string {
	cmd := exec.Command("lpstat", "-p")
	var out bytes.Buffer
	cmd.Stdout = &out

	err := cmd.Run()
	if err != nil {
		log.Fatalf("Error running lpstat command: %v", err)
	}

	lines := strings.Split(out.String(), "\n")
	var statuses []map[string]string

	for _, line := range lines {
		if strings.Contains(line, "printer") {
			status := parseLpstatLine(line)
			if status != nil {
				statuses = append(statuses, status)
			}
		}
	}

	return statuses
}

// Memproses satu baris output lpstat
func parseLpstatLine(line string) map[string]string {
	parts := strings.Fields(line)
	if len(parts) < 4 {
		return nil
	}

	state := "unknown"
	if strings.Contains(line, "is idle") {
		state = "ready"
	} else if strings.Contains(line, "is printing") {
		state = "printing"
	} else if strings.Contains(line, "is disabled") {
		state = "stopped"
	}

	return map[string]string{
		"printer_name": parts[1],
		"state":        state,
		"details":      strings.Join(parts[3:], " "),
	}
}

// Mengirimkan data ke Laravel
func sendToLaravel(status map[string]string) error {
	url := "http://192.168.1.18:8000/api/printer-status"

	payload := fmt.Sprintf(`{
		"name": "%s",
		"status": "%s",
		"details": "%s"
	}`, status["printer_name"], status["state"], status["details"])

	resp, err := http.Post(url, "application/json", bytes.NewBuffer([]byte(payload)))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	return nil
}
