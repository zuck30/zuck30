# TEXENGINE.md

How the `.tex` files in this repo become the `.pdf` files that ship with it.

There is **no CI step, no Makefile, no `latexmk`** — every PDF is compiled locally and
committed. GitHub Pages only serves the committed PDF; the `.tex` sources are excluded
from the build (see `_config.yml`).

---

## 1. Engine

| | |
|---|---|
| Engine | **pdfLaTeX** (`pdfTeX 3.141592653-2.6-1.40.27`) |
| Distribution | **TeX Live 2025** |
| Binary | `/Library/TeX/texbin/pdflatex` |
| Output | `.pdf` directly (no `.dvi`, no PostScript step) |

Check yours:

```bash
pdflatex --version
```

`pdflatex` is used rather than XeLaTeX/LuaLaTeX because every document here only needs
typefaces that ship with TeX Live. System fonts (real Cambria, real Georgia, etc.) would
require XeLaTeX + `fontspec` — see §4.

---

## 2. The build command

Every document is built with the same loop, **three times**:

```bash
for i in 1 2 3; do
  pdflatex -interaction=nonstopmode -halt-on-error document.tex
done
```

### Why three passes

| Pass | What it does |
|---|---|
| 1 | Writes `.aux`, `.toc`, `.out`; cross-references are still `??` |
| 2 | Resolves `\ref`, `\pageref`, TOC entries, hyperlinks |
| 3 | Stabilises `\pageref{LastPage}` and the final TOC page numbers |

A single pass leaves the footer reading `Page 1 of ??` and the TOC empty. Two passes are
usually enough; three is the safe habit, and it is what fixes the
`Page \thepage\ of \pageref{LastPage}` pattern used in the tender documents.

### Flags

| Flag | Reason |
|---|---|
| `-interaction=nonstopmode` | Never stop for keyboard input; run to the end so the log is complete |
| `-halt-on-error` | Abort on the first hard error instead of producing a half-broken PDF |

---

## 3. Documents in this repo

| Source | Output | Notes |
|---|---|---|
| `profile/shadrack-profile.tex` | `profile/shadrack-profile.pdf` | Default face: Helvetica (`helvet`) |
| `profile/shadrack-profile-cambria.tex` | `…-cambria.pdf` | Caladea (Cambria metric clone) |
| `profile/shadrack-profile-lato.tex` | `…-lato.pdf` | Lato |
| `profile/shadrack-profile-garamond.tex` | `…-garamond.pdf` | EB Garamond |
| `profile/shadrack-profile-sourcesanspro.tex` | `…-sourcesanspro.pdf` | Source Sans Pro |
| `profile/shadrack-profile-georgia.tex` | `…-georgia.pdf` | Gelasio (Georgia metric clone) |

`tenders/wajibika-website/proposal.tex` and `financial-proposal.tex` are built the same
way, but the whole `tenders/` directory is git-ignored.

---

## 4. Font variants

All six profile files are **identical except for one block in the preamble**. Regenerate a
variant by copying the base file and swapping these two lines:

```latex
% base (default)
\usepackage{helvet}
\renewcommand{\familydefault}{\sfdefault}
```

for the variant's block:

| Variant | Preamble block |
|---|---|
| Cambria | `\usepackage{caladea}` |
| Lato | `\usepackage{lato}` + `\renewcommand{\familydefault}{\sfdefault}` |
| Garamond | `\usepackage{ebgaramond}` |
| Source Sans Pro | `\usepackage{sourcesanspro}` + `\renewcommand{\familydefault}{\sfdefault}` |
| Georgia | `\usepackage{gelasio}` |

**Cambria and Georgia are not installed on this machine**, so their metric-compatible
TeX Live clones are used (`caladea`, `gelasio`). They match the originals in width and
proportion, not pixel-for-pixel. For the genuine fonts you need the Microsoft fonts
installed plus XeLaTeX:

```bash
xelatex document.tex   # with \usepackage{fontspec} and \setmainfont{Cambria}
```

Keep the sans variants on `\sfdefault` and the serif variants (Cambria, Garamond, Georgia)
on the default roman family.

---

## 5. Verify without opening a viewer

Ghostscript (`gs`) does the checking:

```bash
# page count
gs -dNODISPLAY -dNOSAFER -c "(file.pdf) (r) file runpdfbegin pdfpagecount == quit"

# extracted text — confirms content actually made it into the PDF
gs -q -dNOPAUSE -dBATCH -sDEVICE=txtwrite -o out.txt file.pdf

# render page 1 to PNG for a visual check
gs -q -dNOPAUSE -dBATCH -dFirstPage=1 -dLastPage=1 -sDEVICE=png16m -r100 -o page1.png file.pdf
```

A clean build means: `0` lines starting with `!` in the log, and ideally no
`LaTeX Warning` / `Overfull \hbox` lines.

---

## 6. Clean up build artefacts

```bash
rm -f *.aux *.log *.out *.toc
```

These are never committed. If you forget, they show up as untracked files and should not
be staged.

---

## 7. Relationship to the site

`_config.yml` excludes every `.tex` source:

```yaml
exclude:
  - profile/shadrack-profile.tex
  - profile/shadrack-profile-cambria.tex
  # …
  - landoffer.tex
```

so GitHub Pages publishes **only the PDFs** (e.g.
`https://zuck30.github.io/zuck30/profile/shadrack-profile.pdf`). Push the rebuilt PDF
alongside the `.tex` or the download link keeps serving the old one.

---

## 8. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `Page 1 of ??` in the footer | Only one pass ran — run it three times |
| Empty table of contents | Same cause; `.toc` is written on pass 1 |
| `Undefined control sequence` on `\faMobileAlt` | That icon does not exist in this `fontawesome5`; use `\faMobile` |
| `Missing \endcsname inserted` / text vanishing across pages | Malformed tcolorbox key, e.g. `title={…]}`; use `title={{…}}` |
| `There's no line here to end` | A `\\` immediately after `\end{center}` — add a blank line or `\par` |
| `Font … not loadable` | Font package not installed in TeX Live (`kpsewhich <name>.sty`) |
| Overfull `\hbox` on long URLs | Accept, or add `\setlength{\emergencystretch}{1.5em}` to the preamble |
| PDF builds but the site still shows the old one | The PDF was not committed/pushed, or Pages has not finished deploying |
