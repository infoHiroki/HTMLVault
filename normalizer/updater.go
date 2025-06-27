package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"sort"
	"strings"
)

type FilesJSONEntry struct {
	ID          string   `json:"id"`
	Path        string   `json:"path"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Tags        []string `json:"tags"`
	Created     string   `json:"created"`
	Category    string   `json:"category"`
}

type FilesJSON struct {
	Files []FilesJSONEntry `json:"files"`
}

// files.jsonを更新
func UpdateFilesJSON(normalizedFiles []NormalizedFile) error {
	// 既存のfiles.jsonを読み込み
	filesJSON, err := loadFilesJSON("files.json")
	if err != nil {
		return fmt.Errorf("failed to load files.json: %v", err)
	}

	// 新しいエントリを追加
	for _, normalized := range normalizedFiles {
		entry := FilesJSONEntry{
			ID:          generateID(normalized.Title),
			Path:        normalized.NewPath,
			Title:       normalized.Title,
			Description: normalized.Description,
			Tags:        normalized.Keywords,
			Created:     normalized.CreatedDate,
			Category:    normalized.Category,
		}

		// 重複チェック（パスで判定）
		if !isDuplicateEntry(filesJSON.Files, entry.Path) {
			filesJSON.Files = append(filesJSON.Files, entry)
		}
	}

	// 日付順でソート（新しいものが上）
	sort.Slice(filesJSON.Files, func(i, j int) bool {
		return filesJSON.Files[i].Created > filesJSON.Files[j].Created
	})

	// files.jsonに保存
	err = saveFilesJSON("files.json", filesJSON)
	if err != nil {
		return fmt.Errorf("failed to save files.json: %v", err)
	}

	return nil
}

// files.jsonを読み込み
func loadFilesJSON(filepath string) (*FilesJSON, error) {
	data, err := ioutil.ReadFile(filepath)
	if err != nil {
		if os.IsNotExist(err) {
			// ファイルが存在しない場合は空の構造体を返す
			return &FilesJSON{Files: []FilesJSONEntry{}}, nil
		}
		return nil, err
	}

	var filesJSON FilesJSON
	err = json.Unmarshal(data, &filesJSON)
	if err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %v", err)
	}

	return &filesJSON, nil
}

// files.jsonに保存
func saveFilesJSON(filepath string, filesJSON *FilesJSON) error {
	data, err := json.MarshalIndent(filesJSON, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal JSON: %v", err)
	}

	err = ioutil.WriteFile(filepath, data, 0644)
	if err != nil {
		return fmt.Errorf("failed to write file: %v", err)
	}

	return nil
}

// IDを生成（タイトルから）
func generateID(title string) string {
	// タイトルを小文字に変換し、スペースをハイフンに置換
	id := strings.ToLower(title)
	id = strings.ReplaceAll(id, " ", "-")
	id = strings.ReplaceAll(id, "　", "-") // 全角スペース
	
	// 日本語を英語に変換（IDに適した形）
	replacements := map[string]string{
		"チュートリアル": "tutorial",
		"ガイド": "guide",
		"使い方": "usage",
		"方法": "method",
		"設定": "config",
		"インストール": "install",
		"まとめ": "summary",
		"基本": "basic",
		"入門": "intro",
		"完全": "complete",
		"実践": "practical",
		"講座": "course",
		"マニュアル": "manual",
		"解説": "explanation",
		"要約": "summary",
		"対策": "measures",
		"checklist": "checklist",
		"チェックリスト": "checklist",
	}
	
	for jp, en := range replacements {
		id = strings.ReplaceAll(id, jp, en)
	}
	
	// 英数字とハイフンのみ残す
	var result strings.Builder
	for _, r := range id {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' {
			result.WriteRune(r)
		}
	}
	id = result.String()
	
	// 連続するハイフンを単一に
	for strings.Contains(id, "--") {
		id = strings.ReplaceAll(id, "--", "-")
	}
	
	// 先頭と末尾のハイフンを削除
	id = strings.Trim(id, "-")
	
	// 空の場合はデフォルト値
	if id == "" {
		id = "untitled"
	}
	
	return id
}

// 重複エントリのチェック
func isDuplicateEntry(entries []FilesJSONEntry, path string) bool {
	for _, entry := range entries {
		if entry.Path == path {
			return true
		}
	}
	return false
}

// 既存エントリの更新（パスが変更された場合）
func UpdateExistingEntry(oldPath, newPath string) error {
	filesJSON, err := loadFilesJSON("files.json")
	if err != nil {
		return err
	}

	// 古いパスのエントリを見つけて更新
	for i, entry := range filesJSON.Files {
		if entry.Path == oldPath {
			filesJSON.Files[i].Path = newPath
			break
		}
	}

	return saveFilesJSON("files.json", filesJSON)
}