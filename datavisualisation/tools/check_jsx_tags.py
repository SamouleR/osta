import re
p='src/App.jsx'
s=open(p,encoding='utf-8').read()
# find tags: open <tag ...>, close </tag>, fragment <> and </>
pat=re.compile(r'<(/)?([A-Za-z0-9_:-]+)|(<>)|(</>)')
stack=[]
for m in pat.finditer(s):
    if m.group(3):
        # fragment open
        stack.append(('<>','frag',m.start()))
    elif m.group(4):
        # frag close
        if not stack:
            print('Unmatched frag close at',m.start())
            break
        last=stack.pop()
        if last[1]!='frag':
            print('Mismatch: expected close for',last,'but found frag close at',m.start())
            break
    else:
        isClose = bool(m.group(1))
        tag = m.group(2)
        if isClose:
            if not stack:
                print('Unmatched close tag </{}> at {}'.format(tag,m.start())); break
            last=stack.pop()
            if last[1]!='tag' or last[0].lower()!=tag.lower():
                print('Mismatch: opened {} but closed </{}> at {}'.format(last,tag,m.start())); break
        else:
            # check self-closing by scanning until next '>'
            start=m.start()
            gt = s.find('>',start)
            snippet = s[start:gt+1] if gt!=-1 else s[start: start+50]
            if snippet.endswith('/>'):
                continue
            stack.append((tag,'tag',m.start()))

if stack:
    print('Remaining stack (top 10):')
    for item in stack[-10:]:
        print(item)
else:
    print('No leftover tags')
