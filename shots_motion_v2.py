from playwright.sync_api import sync_playwright
import json
B="http://localhost:3422/"; O="screenshots/motion_v2/"
TIMES=[(1000,"t1s"),(2000,"t2s"),(3000,"t3s"),(3950,"t4s_pre_impact"),(4150,"t4.15s_impact"),(5000,"t5s_morph")]
fps={}
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome")
    for tag,vp,mob in [("mobile",{"width":390,"height":844},True),("desktop",{"width":1280,"height":800},False)]:
        kw=dict(viewport=vp,device_scale_factor=2 if mob else 1,is_mobile=mob,has_touch=mob)
        if mob: kw.update(record_video_dir="/tmp/vid",record_video_size=vp)
        c=b.new_context(**kw); pg=c.new_page(); pg.goto(B)
        for ms,name in TIMES:
            pg.wait_for_function(f"(window.__introT||0)>={ms} || !document.documentElement.dataset.intro || window.__introFps")
            pg.screenshot(path=O+f"{tag}_{name}.png")
        pg.wait_for_function("window.__introFps"); fps[tag]=pg.evaluate("window.__introFps")
        pg.wait_for_timeout(1500); pg.screenshot(path=O+f"{tag}_final.png")
        if mob: vpath=pg.video.path()
        c.close()
    b.close()
print(json.dumps(fps)); open("/tmp/vpath","w").write(vpath)
