from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).resolve().parents[2]
OUT = BASE / 'assets' / 'social' / 'share-card.png'
PHOTO = BASE / 'assets' / 'community-photos' / '20260506-argumentation' / 'arg2-21.jpg'
if not PHOTO.exists():
    PHOTO = BASE / 'assets' / 'community-photos' / 'photo-01.jpg'

FONT = '/usr/share/fonts/opentype/unifont/unifont_jp.otf'
W, H = 1200, 630
PANEL_W = 520

bg = Image.new('RGB', (W, H), '#f5efe4')
photo = Image.open(PHOTO).convert('RGB')
scale = max(PANEL_W / photo.width, H / photo.height)
photo = photo.resize((int(photo.width * scale), int(photo.height * scale)), Image.LANCZOS)
left = (photo.width - PANEL_W) // 2
top = (photo.height - H) // 2
photo = photo.crop((left, top, left + PANEL_W, top + H))
photo = Image.blend(photo, Image.new('RGB', photo.size, '#d88f45'), 0.14)
bg.paste(photo, (W - PANEL_W, 0))

for x in range(170):
    alpha = int(230 * (1 - x / 170))
    overlay = Image.new('RGBA', (1, H), (245, 239, 228, alpha))
    bg.paste(overlay.convert('RGB'), (W - PANEL_W + x, 0), overlay)

d = ImageDraw.Draw(bg)
f_title = ImageFont.truetype(FONT, 50)
f_sub = ImageFont.truetype(FONT, 31)
f_small = ImageFont.truetype(FONT, 24)
f_tag = ImageFont.truetype(FONT, 22)
f_label = ImageFont.truetype(FONT, 21)

def draw_lines(lines, xy, font, fill, spacing=10):
    x, y = xy
    for line in lines:
        d.text((x, y), line, font=font, fill=fill)
        y += font.size + spacing

# Kicker with explicit padding to avoid social-card crop/label crowding.
d.rounded_rectangle((64, 58, 232, 90), radius=16, fill='#b34f2f')
d.text((84, 64), '高雄教育社群', fill='white', font=f_label)

# Main copy stays within the left safe area for link-preview crops.
draw_lines(['高雄市探究與', '實作社群'], (64, 150), f_title, '#213b35', 12)
draw_lines(['讓共備不只是聚會，', '而是可持續累積的教學力量。'], (68, 330), f_sub, '#3f514b', 8)

d.rounded_rectangle((64, 512, 565, 566), radius=20, outline='#d7b98a', width=2)
d.text((92, 527), '共備主題｜成果與活動｜資源專區｜社群成員', font=f_tag, fill='#6b5b45')
d.text((64, 590), 'addielu-phy.github.io/kh-inquiry-community-site', font=f_small, fill='#7a6b58')

OUT.parent.mkdir(parents=True, exist_ok=True)
bg.save(OUT)
print(f'wrote {OUT} {bg.size}')
