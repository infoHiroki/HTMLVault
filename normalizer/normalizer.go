package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"
	"unicode"

	"github.com/PuerkitoBio/goquery"
	"golang.org/x/text/transform"
	"golang.org/x/text/unicode/norm"
)

type NormalizedFile struct {
	OldPath     string
	NewPath     string
	Title       string
	Category    string
	Description string
	Keywords    []string
	CreatedDate string
}

type Metadata struct {
	Title       string
	Description string
	Keywords    []string
	Content     string
}

// HTMLファイルを正規化
func NormalizeFile(path string) (*NormalizedFile, error) {
	// メタデータ抽出
	meta, err := extractMetadata(path)
	if err != nil {
		return nil, fmt.Errorf("failed to extract metadata: %v", err)
	}

	// カテゴリ判定
	category := categorizeContent(meta.Title, meta.Content)

	// 元の日付を抽出（優先順位順）
	originalDate := extractOriginalDate(path)

	// ファイル名生成（元の日付を使用）
	newFileName := generateFileNameWithDate(meta, category, originalDate)

	// 説明文生成（長すぎる場合は切り詰め）
	description := meta.Description
	if len(description) > 100 {
		description = description[:100] + "..."
	}
	if description == "" && len(meta.Content) > 0 {
		// contentから最初の100文字を抽出
		content := strings.TrimSpace(meta.Content)
		if len(content) > 100 {
			content = content[:100] + "..."
		}
		description = content
	}

	// 既存のタグを保持（Git履歴から）
	existingTags := getExistingTags(path)
	keywords := meta.Keywords
	if len(keywords) == 0 && len(existingTags) > 0 {
		keywords = existingTags
	}

	return &NormalizedFile{
		OldPath:     path,
		NewPath:     newFileName,
		Title:       meta.Title,
		Category:    getCategoryName(category),
		Description: description,
		Keywords:    keywords,
		CreatedDate: originalDate,
	}, nil
}

// HTMLファイルからメタデータを抽出
func extractMetadata(htmlPath string) (*Metadata, error) {
	file, err := os.Open(htmlPath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	doc, err := goquery.NewDocumentFromReader(file)
	if err != nil {
		return nil, err
	}

	// タイトル抽出
	title := strings.TrimSpace(doc.Find("title").Text())
	if title == "" {
		title = strings.TrimSpace(doc.Find("h1").First().Text())
	}
	if title == "" {
		title = "Untitled"
	}

	// 説明抽出
	description := strings.TrimSpace(doc.Find("meta[name=description]").AttrOr("content", ""))
	if description == "" {
		// 最初のpタグから抽出
		firstP := strings.TrimSpace(doc.Find("p").First().Text())
		if len(firstP) > 0 {
			description = firstP
		}
	}

	// キーワード抽出
	keywordsStr := doc.Find("meta[name=keywords]").AttrOr("content", "")
	var keywords []string
	if keywordsStr != "" {
		for _, kw := range strings.Split(keywordsStr, ",") {
			kw = strings.TrimSpace(kw)
			if kw != "" {
				keywords = append(keywords, kw)
			}
		}
	}

	// 本文抽出（カテゴリ判定用）
	content := strings.TrimSpace(doc.Find("body").Text())

	return &Metadata{
		Title:       title,
		Description: description,
		Keywords:    keywords,
		Content:     content,
	}, nil
}

// コンテンツからカテゴリを判定
func categorizeContent(title, content string) string {
	categoryKeywords := map[string][]string{
		"tech":   {"react", "javascript", "python", "docker", "github", "vscode", "api", "web", "開発", "プログラミング", "code", "tutorial", "go", "java", "css", "html", "node", "npm"},
		"edu":    {"claude", "chatgpt", "whisper", "ai", "機械学習", "深層学習", "人工知能", "教育", "学習", "training", "研修", "トレーニング", "スキル"},
		"design": {"figma", "framer", "aseprite", "デザイン", "ui", "ux", "adobe", "photoshop", "illustrator", "色", "カラー", "レイアウト"},
		"system": {"制度", "補助金", "助成", "申請", "手続き", "行政", "給付", "支援", "法律", "規則"},
		"biz":    {"ビジネス", "business", "企業", "経営", "マーケティング", "営業", "売上", "収益", "戦略"},
	}

	text := strings.ToLower(title + " " + content)

	// スコアベースでカテゴリ判定
	scores := make(map[string]int)
	for category, keywords := range categoryKeywords {
		for _, keyword := range keywords {
			if strings.Contains(text, strings.ToLower(keyword)) {
				scores[category]++
			}
		}
	}

	// 最高スコアのカテゴリを選択
	maxScore := 0
	bestCategory := "misc"
	for category, score := range scores {
		if score > maxScore {
			maxScore = score
			bestCategory = category
		}
	}

	return bestCategory
}

// ファイル名生成（指定された日付を使用）
func generateFileNameWithDate(meta *Metadata, category, date string) string {
	// タイトルから安全な文字列を生成
	safe := sanitizeTitle(meta.Title)
	
	return fmt.Sprintf("%s-%s-%s.html", date, category, safe)
}

// 元のファイル名生成（後方互換性のため）
func generateFileName(meta *Metadata, category string) string {
	date := time.Now().Format("2006-01-02")
	return generateFileNameWithDate(meta, category, date)
}

// タイトルをファイル名用に正規化
func sanitizeTitle(title string) string {
	// 日本語を英語に変換（簡易版）
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
	}
	
	safe := strings.ToLower(title)
	
	// 日本語置換
	for jp, en := range replacements {
		safe = strings.ReplaceAll(safe, jp, en)
	}
	
	// Unicode正規化
	t := transform.Chain(norm.NFD, transform.RemoveFunc(isMn), norm.NFC)
	safe, _, _ = transform.String(t, safe)
	
	// 英数字とハイフンのみ残す
	safe = regexp.MustCompile(`[^a-z0-9\s-]`).ReplaceAllString(safe, "")
	safe = regexp.MustCompile(`\s+`).ReplaceAllString(safe, "-")
	safe = regexp.MustCompile(`-+`).ReplaceAllString(safe, "-")
	safe = strings.Trim(safe, "-")
	
	// 長さ制限
	if len(safe) > 30 {
		safe = safe[:30]
	}
	if safe == "" {
		safe = "untitled"
	}
	
	return safe
}

// Unicode正規化用のヘルパー関数
func isMn(r rune) bool {
	return unicode.Is(unicode.Mn, r)
}

// 元の作成日付を抽出
func extractOriginalDate(filePath string) string {
	// マッピング辞書（Git履歴から取得）
	dateMapping := map[string]string{
		"2025-06-27-tech-react.html":                     "2025-04-19",
		"2025-06-27-tech-fastapibasicexplanation.html":  "2025-04-22",
		"2025-06-27-tech-python.html":                    "2025-04-23",
		"2025-06-27-tech-obsidian.html":                  "2025-05-06",
		"2025-06-27-tech-whisper-ai-guide.html":          "2025-05-13",
		"2025-06-27-tech-apscheduler.html":               "2025-05-16",
		"2025-06-27-edu-ai.html":                         "2025-05-19",
		"2025-06-27-tech-firebase-explanation.html":      "2025-05-24",
		"2025-06-27-tech-uv-python-package-manager-comp.html": "2025-06-09",
		"2025-06-27-edu-ai-practical7.html":              "2025-06-18",
	}

	// ファイル名から取得
	fileName := filepath.Base(filePath)
	if date, exists := dateMapping[fileName]; exists {
		return date
	}

	// ファイル名から日付パターンを抽出
	re := regexp.MustCompile(`(\d{4}-\d{2}-\d{2})`)
	if matches := re.FindStringSubmatch(fileName); len(matches) > 1 {
		return matches[1]
	}

	// フォールバック: 今日の日付
	return time.Now().Format("2006-01-02")
}

// 既存のタグを取得
func getExistingTags(filePath string) []string {
	// Git履歴から既存タグを取得するマッピング
	tagMapping := map[string][]string{
		"2025-06-27-tech-react.html": {"React", "ライブラリ", "フロントエンド", "JavaScript", "開発ツール"},
		"2025-06-27-tech-fastapibasicexplanation.html": {"Python", "FastAPI", "WebAPI", "バックエンド", "REST"},
		"2025-06-27-tech-python.html": {"Python", "フレームワーク", "Django", "Flask", "開発ツール"},
		"2025-06-27-tech-obsidian.html": {"Obsidian", "ディレクトリ構造", "情報整理", "ノートテイキング"},
		"2025-06-27-tech-whisper-ai-guide.html": {"AI", "Whisper", "音声認識", "Python", "機械学習"},
		"2025-06-27-tech-apscheduler.html": {"Python", "APScheduler", "定期実行", "自動化", "スケジュール"},
		"2025-06-27-edu-ai.html": {"AI", "用語集", "機械学習", "深層学習", "生成AI"},
		"2025-06-27-tech-firebase-explanation.html": {"Firebase", "クラウド", "バックエンド", "Google", "モバイル開発"},
		"2025-06-27-tech-uv-python-package-manager-comp.html": {"Python", "UV", "パッケージマネージャー", "Rust", "開発ツール"},
		"2025-06-27-edu-ai-practical7.html": {"AI", "ツール", "活用術", "プレゼンテーション", "実践"},
	}

	fileName := filepath.Base(filePath)
	if tags, exists := tagMapping[fileName]; exists {
		return tags
	}
	return []string{}
}

// カテゴリコードから表示名に変換
func getCategoryName(categoryCode string) string {
	categoryNames := map[string]string{
		"system": "制度・補助金",
		"edu":    "教育・AI",
		"tech":   "技術・開発",
		"design": "デザイン",
		"biz":    "ビジネス",
		"misc":   "その他",
	}
	
	if name, exists := categoryNames[categoryCode]; exists {
		return name
	}
	return "その他"
}