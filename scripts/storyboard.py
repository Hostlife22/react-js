"""Build a labeled contact sheet from the actual rendered composition."""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
timeline=json.loads((ROOT/'src/timeline.json').read_text())
font_path='/System/Library/Fonts/Supplemental/Arial.ttf'
try:
    title_font=ImageFont.truetype(font_path,19)
    detail_font=ImageFont.truetype(font_path,15)
except OSError:
    title_font=ImageFont.load_default()
    detail_font=title_font
tile_width,tile_height=480,324
sheet=Image.new('RGB',(tile_width*4,tile_height*4),'#f4eddc')
draw=ImageDraw.Draw(sheet)
for index,chapter in enumerate(timeline['chapters']):
    still=Image.open(ROOT/f'out/stills/{chapter["id"]}.png').convert('RGB')
    still.thumbnail((tile_width,270),Image.Resampling.LANCZOS)
    x=(index%4)*tile_width
    y=(index//4)*tile_height
    sheet.paste(still,(x,y))
    draw.text((x+14,y+279),f'{index+1:02d}  {chapter["label"]}',fill='#292c25',font=title_font)
    draw.text((x+14,y+303),f'{chapter["year"]}   ·   {chapter["start"]:.2f}–{chapter["end"]:.2f} s',fill='#66695d',font=detail_font)
sheet.save(ROOT/'out/storyboard.jpg',quality=94)
Image.open(ROOT/'out/stills/modern.png').convert('RGB').save(ROOT/'out/poster.jpg',quality=95)
print('Contact sheet: out/storyboard.jpg')
