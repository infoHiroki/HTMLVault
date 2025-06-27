package main

import (
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"
)

type FileInfo struct {
	Path        string
	CurrentName string
	NeedsRename bool
	Size        int64
	ModTime     time.Time
}

// HTMLファイルをスキャンして命名規則に従っていないファイルを検出
func ScanFiles(dir string) ([]FileInfo, error) {
	var nonCompliantFiles []FileInfo
	
	// 命名規則のパターン: YYYY-MM-DD-category-content.html
	namePattern := regexp.MustCompile(`^\d{4}-\d{2}-\d{2}-(system|edu|tech|design|biz|misc)-.+\.html$`)

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// HTMLファイルのみ処理
		if !strings.HasSuffix(strings.ToLower(info.Name()), ".html") {
			return nil
		}

		// ディレクトリをスキップ
		if info.IsDir() {
			return nil
		}

		// 命名規則チェック
		if !namePattern.MatchString(info.Name()) {
			nonCompliantFiles = append(nonCompliantFiles, FileInfo{
				Path:        path,
				CurrentName: info.Name(),
				NeedsRename: true,
				Size:        info.Size(),
				ModTime:     info.ModTime(),
			})
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return nonCompliantFiles, nil
}

// ファイル名が命名規則に従っているかチェック
func IsCompliantName(filename string) bool {
	namePattern := regexp.MustCompile(`^\d{4}-\d{2}-\d{2}-(system|edu|tech|design|biz|misc)-.+\.html$`)
	return namePattern.MatchString(filename)
}

// カテゴリコードの検証
func IsValidCategory(category string) bool {
	validCategories := map[string]bool{
		"system": true,
		"edu":    true,
		"tech":   true,
		"design": true,
		"biz":    true,
		"misc":   true,
	}
	return validCategories[category]
}