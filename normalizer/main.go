package main

import (
	"flag"
	"fmt"
	"log"
	"os"
)

const Version = "1.0.0"

func main() {
	var (
		dryRun   = flag.Bool("dry-run", false, "Show what would be done without making changes")
		autoMode = flag.Bool("auto", false, "Run automatically without confirmation")
		help     = flag.Bool("help", false, "Show help information")
	)
	flag.Parse()

	if *help {
		showHelp()
		return
	}

	fmt.Printf("HTMLVault File Normalizer v%s\n", Version)
	fmt.Println("=================================")

	// スキャン実行
	fmt.Println("\nScanning html-files/ directory...")
	files, err := ScanFiles("html-files")
	if err != nil {
		log.Fatalf("Error scanning files: %v", err)
	}

	if len(files) == 0 {
		fmt.Println("✅ All files are already compliant with naming convention.")
		return
	}

	fmt.Printf("Found %d non-compliant file(s):\n\n", len(files))

	// 正規化処理
	var normalizedFiles []NormalizedFile
	for _, file := range files {
		normalized, err := NormalizeFile(file.Path)
		if err != nil {
			fmt.Printf("⚠️  Error processing %s: %v\n", file.CurrentName, err)
			continue
		}
		normalizedFiles = append(normalizedFiles, *normalized)

		// 処理結果表示
		fmt.Printf("📄 %s\n", file.CurrentName)
		fmt.Printf("   Title: \"%s\"\n", normalized.Title)
		fmt.Printf("   Category: %s\n", normalized.Category)
		fmt.Printf("   New name: %s\n", normalized.NewPath)
		fmt.Println("")
		fmt.Println("   Changes:")
		fmt.Println("   ✓ Rename file")
		fmt.Println("   ✓ Add to files.json")
		fmt.Println("")
	}

	if *dryRun {
		fmt.Println("🔍 Dry run mode - no changes made.")
		return
	}

	// ユーザー確認
	if !*autoMode {
		fmt.Print("Apply changes? [Y/n]: ")
		var response string
		fmt.Scanln(&response)
		if response != "" && response != "Y" && response != "y" {
			fmt.Println("Operation cancelled.")
			return
		}
	}

	// 実行
	fmt.Println("Processing...")
	successCount := 0

	for _, normalized := range normalizedFiles {
		// ファイルリネーム
		err := os.Rename(normalized.OldPath, "html-files/"+normalized.NewPath)
		if err != nil {
			fmt.Printf("❌ Failed to rename %s: %v\n", normalized.OldPath, err)
			continue
		}
		fmt.Printf("✅ Renamed: %s → %s\n", 
			normalized.OldPath[len("html-files/"):], normalized.NewPath)
		successCount++
	}

	// files.json更新
	if successCount > 0 {
		err = UpdateFilesJSON(normalizedFiles[:successCount])
		if err != nil {
			fmt.Printf("⚠️  Warning: Failed to update files.json: %v\n", err)
		} else {
			fmt.Println("✅ Updated: files.json")
		}
	}

	fmt.Printf("\nComplete! Processed %d file(s) successfully.\n", successCount)
}

func showHelp() {
	fmt.Printf("HTMLVault File Normalizer v%s\n\n", Version)
	fmt.Println("USAGE:")
	fmt.Println("  ./htmlvault-normalizer [OPTIONS]")
	fmt.Println("")
	fmt.Println("OPTIONS:")
	fmt.Println("  -dry-run    Show what would be done without making changes")
	fmt.Println("  -auto       Run automatically without confirmation")
	fmt.Println("  -help       Show this help information")
	fmt.Println("")
	fmt.Println("EXAMPLES:")
	fmt.Println("  ./htmlvault-normalizer                # Interactive mode")
	fmt.Println("  ./htmlvault-normalizer -dry-run       # Preview changes")
	fmt.Println("  ./htmlvault-normalizer -auto          # Automatic mode")
}