# HTMLVault File Normalizer - Go実装設計書 (KISS原則)

## 設計哲学
**Keep It Simple, Stupid (KISS原則)**
- ワンバイナリ、ワンコマンド
- 設定ファイル不要
- 3つの機能のみ
- 依存関係最小

---

## 1. アーキテクチャ（超シンプル）

```
htmlvault-normalizer/
├── main.go           # エントリーポイント + CLI
├── scanner.go        # HTMLファイル検出
├── normalizer.go     # ファイル名正規化 + メタデータ抽出
├── updater.go        # files.json更新
└── go.mod           # 依存関係管理
```

### 依存関係（2つのみ）
```go
module htmlvault-normalizer

go 1.21

require (
    github.com/PuerkitoBio/goquery v1.8.1  // HTMLパース
    golang.org/x/text v0.14.0              // 日本語テキスト処理
)
```

---

## 2. 核心機能（3つのみ）

### 機能1: スキャン
```go
type FileInfo struct {
    Path        string
    CurrentName string
    NeedsRename bool
    Size        int64
    ModTime     time.Time
}

func ScanFiles(dir string) ([]FileInfo, error)
```

### 機能2: 正規化
```go
type NormalizedFile struct {
    OldPath     string
    NewPath     string
    Title       string
    Category    string
    Description string
    Keywords    []string
    CreatedDate string
}

func NormalizeFile(path string) (*NormalizedFile, error)
```

### 機能3: 更新
```go
type FilesJSONEntry struct {
    ID          string   `json:"id"`
    Path        string   `json:"path"`
    Title       string   `json:"title"`
    Description string   `json:"description"`
    Tags        []string `json:"tags"`
    Created     string   `json:"created"`
    Category    string   `json:"category"`
}

func UpdateFilesJSON(files []NormalizedFile) error
```

---

## 3. 実装仕様

### 3.1 カテゴリ判定（ハードコード）
```go
var categoryKeywords = map[string][]string{
    "tech":   {"react", "javascript", "python", "docker", "github", "vscode", "api", "web", "開発"},
    "ai":     {"claude", "chatgpt", "whisper", "ai", "機械学習", "深層学習", "人工知能"},
    "design": {"figma", "framer", "aseprite", "デザイン", "ui", "ux", "adobe"},
    "edu":    {"教育", "学習", "training", "研修", "トレーニング", "スキル"},
    "system": {"制度", "補助金", "助成", "申請", "手続き", "行政"},
    "biz":    {"ビジネス", "business", "企業", "経営", "マーケティング"},
}

func categorizeContent(title, content string) string {
    text := strings.ToLower(title + " " + content)
    
    for category, keywords := range categoryKeywords {
        for _, keyword := range keywords {
            if strings.Contains(text, strings.ToLower(keyword)) {
                return category
            }
        }
    }
    return "misc" // デフォルト
}
```

### 3.2 メタデータ抽出（最小限）
```go
type Metadata struct {
    Title       string
    Description string
    Keywords    []string
    Content     string
}

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
    title := doc.Find("title").Text()
    if title == "" {
        title = doc.Find("h1").First().Text()
    }
    
    // 説明抽出
    description := doc.Find("meta[name=description]").AttrOr("content", "")
    if description == "" {
        // 最初のpタグから抽出
        description = doc.Find("p").First().Text()
        if len(description) > 100 {
            description = description[:100] + "..."
        }
    }
    
    // キーワード抽出
    keywords := strings.Split(doc.Find("meta[name=keywords]").AttrOr("content", ""), ",")
    
    // 本文抽出（カテゴリ判定用）
    content := doc.Find("body").Text()
    
    return &Metadata{
        Title:       strings.TrimSpace(title),
        Description: strings.TrimSpace(description),
        Keywords:    keywords,
        Content:     content,
    }, nil
}
```

### 3.3 ファイル名生成（固定ルール）
```go
func generateFileName(meta *Metadata, category string) string {
    date := time.Now().Format("2006-01-02")
    
    // タイトルから安全な文字列を生成
    safe := sanitizeTitle(meta.Title)
    
    return fmt.Sprintf("%s-%s-%s.html", date, category, safe)
}

func sanitizeTitle(title string) string {
    // 日本語を英語に変換（簡易版）
    replacements := map[string]string{
        "チュートリアル": "tutorial",
        "ガイド": "guide",
        "使い方": "usage",
        "方法": "method",
        "設定": "config",
        "インストール": "install",
    }
    
    safe := strings.ToLower(title)
    
    // 置換実行
    for jp, en := range replacements {
        safe = strings.ReplaceAll(safe, jp, en)
    }
    
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
```

---

## 4. CLIインターフェース

### 使用法
```bash
# 基本実行
./htmlvault-normalizer

# ドライラン（実行せずに結果表示）
./htmlvault-normalizer -dry-run

# 自動実行（確認なし）
./htmlvault-normalizer -auto

# ヘルプ表示
./htmlvault-normalizer -help
```

### 実行フロー
```
1. html-files/ディレクトリをスキャン
2. 命名規則に従っていないファイルを検出
3. 各ファイルの処理内容を表示:
   - 現在のファイル名
   - 提案される新しいファイル名
   - 抽出されたメタデータ
   - 判定されたカテゴリ
4. ユーザー確認（-autoフラグで省略）
5. ファイルリネーム実行
6. files.json更新
7. 処理結果レポート表示
```

### 出力例
```
HTMLVault File Normalizer v1.0.0
=================================

Scanning html-files/ directory...
Found 1 non-compliant file:

📄 vscode_tutorial_summary.html
   Title: "VS Code Tutorial Summary"
   Category: tech (confidence: high)
   New name: 2025-06-27-tech-vscode-tutorial-summary.html
   
   Changes:
   ✓ Rename file
   ✓ Add to files.json
   
Apply changes? [Y/n]: y

Processing...
✅ Renamed: vscode_tutorial_summary.html → 2025-06-27-tech-vscode-tutorial-summary.html
✅ Updated: files.json

Complete! Processed 1 file successfully.
```

---

## 5. エラーハンドリング（最小限）

```go
// エラータイプ
type NormalizerError struct {
    Type    string
    File    string
    Message string
}

func (e *NormalizerError) Error() string {
    return fmt.Sprintf("[%s] %s: %s", e.Type, e.File, e.Message)
}

// エラー処理戦略: ログ出力して続行
func handleError(err error, file string) {
    log.Printf("Warning: %s - %v", file, err)
    // パニックせず処理続行
}
```

---

## 6. ディレクトリ構造（実装後）

```
HTMLVault/
├── htmlvault-normalizer*           # Goバイナリ（実行ファイル）
├── normalizer/                     # Go源泉コード
│   ├── main.go                    # エントリーポイント
│   ├── scanner.go                 # ファイルスキャン
│   ├── normalizer.go              # 正規化処理
│   ├── updater.go                 # JSON更新
│   ├── go.mod                     # モジュール定義
│   └── go.sum                     # 依存関係チェックサム
├── html-files/                    # HTMLファイル格納（既存）
├── files.json                     # メタデータ（自動更新）
├── docs/                          # ドキュメント（既存）
└── ...                           # その他既存ファイル
```

---

## 7. 実装手順

### Phase 1: 基盤構築
1. Go環境セットアップ
2. プロジェクト構造作成
3. 基本CLI実装

### Phase 2: 核心機能
1. HTMLファイルスキャン機能
2. メタデータ抽出機能
3. カテゴリ判定機能

### Phase 3: 統合
1. ファイルリネーム機能
2. files.json更新機能
3. エラーハンドリング

### Phase 4: 完成
1. CLI改善
2. テスト実行
3. ドキュメント更新

---

## 8. 利点

### KISS原則による利点
- **シンプル**: 理解しやすい構造
- **高速**: コンパイル済みバイナリ
- **安全**: 型安全性とエラーハンドリング
- **保守**: 最小限のコード量
- **デプロイ**: 単一バイナリで配布可能

### 既存システムとの比較
| 項目 | 既存JS版 | Go版 |
|------|----------|------|
| 実行速度 | 遅い | 高速 |
| 依存関係 | 多い | 最小 |
| デプロイ | 複雑 | 簡単 |
| 保守性 | 低い | 高い |
| エラー処理 | 複雑 | シンプル |

---

**作成日**: 2025年6月27日  
**バージョン**: 2.0.0 (Go実装版)  
**設計原則**: KISS (Keep It Simple, Stupid)  
**作成者**: HTMLVault開発チーム