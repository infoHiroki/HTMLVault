#!/usr/bin/env python3
import json
import re

def fix_files_json():
    # 日付マッピング（Git履歴から取得）
    date_mapping = {
        "2025-06-27-tech-react.html": "2025-04-19",
        "2025-06-27-tech-fastapibasicexplanation.html": "2025-04-22",
        "2025-06-27-tech-python.html": "2025-04-23",
        "2025-06-27-tech-obsidian.html": "2025-05-06",
        "2025-06-27-tech-whisper-ai-guide.html": "2025-05-13",
        "2025-06-27-tech-apscheduler.html": "2025-05-16",
        "2025-06-27-edu-ai.html": "2025-05-19",
        "2025-06-27-tech-firebase-explanation.html": "2025-05-24",
        "2025-06-27-tech-uv-python-package-manager-comp.html": "2025-06-09",
        "2025-06-27-edu-ai-practical7.html": "2025-06-18"
    }
    
    # タグマッピング（Git履歴から取得）
    tag_mapping = {
        "2025-06-27-tech-react.html": ["React", "ライブラリ", "フロントエンド", "JavaScript", "開発ツール"],
        "2025-06-27-tech-fastapibasicexplanation.html": ["Python", "FastAPI", "WebAPI", "バックエンド", "REST"],
        "2025-06-27-tech-python.html": ["Python", "フレームワーク", "Django", "Flask", "開発ツール"],
        "2025-06-27-tech-obsidian.html": ["Obsidian", "ディレクトリ構造", "情報整理", "ノートテイキング"],
        "2025-06-27-tech-whisper-ai-guide.html": ["AI", "Whisper", "音声認識", "Python", "機械学習"],
        "2025-06-27-tech-apscheduler.html": ["Python", "APScheduler", "定期実行", "自動化", "スケジュール"],
        "2025-06-27-edu-ai.html": ["AI", "用語集", "機械学習", "深層学習", "生成AI"],
        "2025-06-27-tech-firebase-explanation.html": ["Firebase", "クラウド", "バックエンド", "Google", "モバイル開発"],
        "2025-06-27-tech-uv-python-package-manager-comp.html": ["Python", "UV", "パッケージマネージャー", "Rust", "開発ツール"],
        "2025-06-27-edu-ai-practical7.html": ["AI", "ツール", "活用術", "プレゼンテーション", "実践"]
    }

    # files.jsonを読み込み
    with open('files.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 修正カウンター
    fixed_count = 0

    # 各エントリを修正
    for file_entry in data['files']:
        path = file_entry['path']
        
        # 日付修正
        if path in date_mapping:
            original_date = date_mapping[path]
            file_entry['created'] = original_date
            
            # ファイル名の日付部分も修正
            new_path = re.sub(r'^\d{4}-\d{2}-\d{2}', original_date, path)
            file_entry['path'] = new_path
            
            print(f"✅ 日付修正: {path} → {new_path} (作成日: {original_date})")
            fixed_count += 1

        # タグ修正
        if path in tag_mapping and (file_entry['tags'] is None or len(file_entry['tags']) == 0):
            file_entry['tags'] = tag_mapping[path]
            print(f"✅ タグ復元: {path} → {len(tag_mapping[path])}個のタグ")

    # 日付順でソート（新しいものが上）
    data['files'].sort(key=lambda x: x['created'], reverse=True)

    # files.jsonに保存
    with open('files.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n🎉 修正完了: {fixed_count}個のファイルの日付を復元しました")

if __name__ == "__main__":
    fix_files_json()