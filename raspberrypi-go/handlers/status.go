package handlers

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os/exec"
	"strings"
)

// PrinterStatus represents the status of a printer.
type PrinterStatus struct {
	Name    string `json:"name"`
	State   string `json:"status"`
	Details string `json:"details"`
}

// PrinterStatusHandler handles HTTP requests to fetch printer statuses.
func PrinterStatusHandler(w http.ResponseWriter, r *http.Request) {
	statuses := getPrinterStatuses()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(statuses)
}

// Menjalankan lpstat untuk mendapatkan status printer
func getPrinterStatuses() []PrinterStatus {
	cmd := exec.Command("lpstat", "-p")
	var out bytes.Buffer
	cmd.Stdout = &out

	err := cmd.Run()
	if err != nil {
		log.Fatalf("Error running lpstat command: %v", err)
	}

	lines := strings.Split(out.String(), "\n")
	var statuses []PrinterStatus

	for _, line := range lines {
		if strings.Contains(line, "printer") {
			status := parseLpstatLine(line)
			if status != nil {
				statuses = append(statuses, *status)
			}
		}
	}

	return statuses
}

// Memproses satu baris output lpstat
func parseLpstatLine(line string) *PrinterStatus {
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

	return &PrinterStatus{
		Name:    parts[1],
		State:   state,
		Details: strings.Join(parts[3:], " "),
	}
}
