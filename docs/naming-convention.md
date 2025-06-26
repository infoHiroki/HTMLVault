# ファイル命名規則ガイド

## 📋 概要

HTMLファイルの統一的な管理を目的とした命名規則です。

## 🎯 基本パターン

```
{日付}-{カテゴリ}-{内容説明}.html
```

### 例
- `2025-06-26-tech-go-tutorial.html`
- `2025-12-15-system-tax-reform.html`
- `2026-01-10-design-ui-guide.html`

## 📅 日付形式

**必須**: `YYYY-MM-DD`

- 年は4桁
- 月・日は2桁（ゼロパディング）
- 作成日または主要更新日を使用

## 🏷️ カテゴリコード

| カテゴリ | コード | 説明 | 例 |
|---------|-------|------|-----|
| 制度・補助金 | `system` | 政府制度、補助金、法制度 | `system-education-training` |
| 教育・AI | `edu` | 教育、AI、学習コンテンツ | `edu-ai-summary` |
| 技術・開発 | `tech` | プログラミング、開発技術 | `tech-go-tutorial` |
| デザイン | `design` | UI/UX、グラフィック | `design-color-guide` |
| ビジネス | `biz` | 経営、マーケティング | `biz-strategy-plan` |
| その他 | `misc` | 上記以外 | `misc-general-info` |

## 📝 内容説明部分

### 命名ルール
1. **英語またはローマ字を使用**
2. **単語間はハイフン（-）で区切り**
3. **簡潔で分かりやすく**
4. **20文字以内を推奨**

### 良い例
- `go-tutorial` （Go言語チュートリアル）
- `claude-code` （Claude Code関連）
- `llmo-checklist` （LLMOチェックリスト）
- `education-training` （教育訓練制度）

### 避けるべき例
- `GoLanguageTutorialForBeginners` （長すぎる）
- `go_tutorial` （アンダースコア使用）
- `Go言語` （日本語使用）
- `tutorial123` （無意味な数字）

## 🔄 既存ファイルの変更履歴

| 旧ファイル名 | 新ファイル名 | 変更日 |
|-------------|-------------|-------|
| `education_training_infographic.html` | `2025-06-26-system-education-training.html` | 2025-06-26 |
| `education_ai_summary.html` | `2025-06-26-edu-ai-summary.html` | 2025-06-26 |
| `llmo_checklist_infographic.html` | `2025-06-26-tech-llmo-checklist.html` | 2025-06-26 |
| `ClodeCode2025-06-26.html` | `2025-06-26-tech-claude-code.html` | 2025-06-26 |
| `go_language_tutorial.html` | `2025-06-26-tech-go-tutorial.html` | 2025-06-26 |

## 🛠️ 実装ガイド

### 新規ファイル作成時

1. **`file-helper.html`を使用** （推奨）
   - フォームに入力すると自動で適切なファイル名を生成
   - JSON設定も同時に生成される

2. **手動作成時**
   - この命名規則に従ってファイル名を決定
   - `files.json`に対応するエントリを追加

### ファイル名生成例

```javascript
// 現在の日付を取得
const today = new Date().toISOString().split('T')[0]; // "2025-06-26"

// カテゴリと内容から生成
const category = "tech";
const content = "react-hooks";
const filename = `${today}-${category}-${content}.html`;
// 結果: "2025-06-26-tech-react-hooks.html"
```

## 📈 メリット

1. **時系列管理**: 日付でソートが容易
2. **カテゴリ識別**: ファイル名でカテゴリが即座に判別
3. **一貫性**: 統一された形式で管理しやすい
4. **検索性**: パターンマッチングによる検索が容易
5. **拡張性**: 新しいカテゴリの追加が簡単

## 🔮 将来の拡張

### バージョン管理
同じ内容の更新版：
```
2025-06-26-tech-go-tutorial.html    # 初版
2025-07-15-tech-go-tutorial-v2.html # 改訂版
```

### サブカテゴリ
より詳細な分類が必要な場合：
```
2025-06-26-tech-frontend-react.html
2025-06-26-tech-backend-go.html
2025-06-26-tech-devops-docker.html
```

---

**作成日**: 2025年6月26日  
**最終更新**: 2025年6月26日  
**バージョン**: 1.0.0