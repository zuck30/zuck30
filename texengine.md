# texengine.md

how the `.tex` files in this repo become the `.pdf` files that ship with it. there is **no ci step, no makefile, no `latexmk`**: every pdf is compiled locally and committed. github pages only serves the committed pdf, and the `.tex` sources are excluded from the build (see `_config.yml`).

# 1. engine

<table align="center">
  <tr><td><strong>engine</strong></td><td><code>pdflatex</code>, pdftex 3.141592653-2.6-1.40.27</td></tr>
  <tr><td><strong>distribution</strong></td><td>tex live 2025</td></tr>
  <tr><td><strong>binary</strong></td><td><code>/Library/TeX/texbin/pdflatex</code></td></tr>
  <tr><td><strong>output</strong></td><td><code>.pdf</code> directly, no <code>.dvi</code> and no postscript step</td></tr>
</table>

check the local install with `pdflatex --version`. pdflatex is used rather than xelatex or lualatex because every document here needs only typefaces that ship with tex live. system fonts such as real cambria or georgia would need xelatex with `fontspec`.

# 2. the build command

every document is built with the same loop, three times:

```bash
for i in 1 2 3; do
  pdflatex -interaction=nonstopmode -halt-on-error document.tex
done
```

# the three passes

<table align="center">
  <tr><td><strong>pass 1</strong></td><td>writes <code>.aux</code>, <code>.toc</code> and <code>.out</code>, cross references are still <code>??</code></td></tr>
  <tr><td><strong>pass 2</strong></td><td>resolves <code>\ref</code>, <code>\pageref</code>, toc entries and hyperlinks</td></tr>
  <tr><td><strong>pass 3</strong></td><td>stabilises <code>\pageref{LastPage}</code> and the final toc page numbers</td></tr>
</table>

a single pass leaves the footer reading `Page 1 of ??` and the table of contents empty. two passes are usually enough, three is the safe habit, and it is what fixes the `Page \thepage\ of \pageref{LastPage}` pattern used in the tender documents.

# flags

<table align="center">
  <tr><td><strong>-interaction=nonstopmode</strong></td><td>never stop for keyboard input, run to the end so the log is complete</td></tr>
  <tr><td><strong>-halt-on-error</strong></td><td>abort on the first hard error instead of producing a broken pdf</td></tr>
</table>

# 3. documents in this repo

<table align="center">
  <tr><td><strong>source</strong></td><td><strong>output</strong></td><td><strong>face</strong></td></tr>
  <tr><td><code>profile/shadrack-profile.tex</code></td><td><code>shadrack-profile.pdf</code></td><td>helvetica</td></tr>
  <tr><td><code>profile/-cambria.tex</code></td><td><code>-cambria.pdf</code></td><td>caladea</td></tr>
  <tr><td><code>profile/-lato.tex</code></td><td><code>-lato.pdf</code></td><td>lato</td></tr>
  <tr><td><code>profile/-garamond.tex</code></td><td><code>-garamond.pdf</code></td><td>eb garamond</td></tr>
  <tr><td><code>profile/-sourcesanspro.tex</code></td><td><code>-sourcesanspro.pdf</code></td><td>source sans pro</td></tr>
  <tr><td><code>profile/-georgia.tex</code></td><td><code>-georgia.pdf</code></td><td>gelasio</td></tr>
</table>

the tender documents in `tenders/wajibika-website/` are built the same way, but the whole `tenders/` directory is git ignored.

# 4. font variants

all six profile files are identical except for one block in the preamble. regenerate a variant by copying the base file and swapping these two lines:

```latex
\usepackage{helvet}
\renewcommand{\familydefault}{\sfdefault}
```

for the variant block:

<table align="center">
  <tr><td><strong>cambria</strong></td><td><code>\usepackage{caladea}</code></td></tr>
  <tr><td><strong>lato</strong></td><td><code>\usepackage{lato}</code> plus <code>\renewcommand{\familydefault}{\sfdefault}</code></td></tr>
  <tr><td><strong>garamond</strong></td><td><code>\usepackage{ebgaramond}</code></td></tr>
  <tr><td><strong>source sans pro</strong></td><td><code>\usepackage{sourcesanspro}</code> plus the <code>\sfdefault</code> line</td></tr>
  <tr><td><strong>georgia</strong></td><td><code>\usepackage{gelasio}</code></td></tr>
</table>

cambria and georgia are not installed on this machine, so their metric compatible tex live clones are used, caladea and gelasio. they match the originals in width and proportion, not pixel for pixel. for the genuine fonts, install them and compile with xelatex:

```bash
xelatex document.tex   # with \usepackage{fontspec} and \setmainfont{Cambria}
```

keep the sans variants on `\sfdefault` and the serif variants, cambria, garamond and georgia, on the default roman family.

# 5. verify without opening a viewer

ghostscript does the checking:

```bash
# page count
gs -dNODISPLAY -dNOSAFER \
   -c "(file.pdf) (r) file runpdfbegin pdfpagecount == quit"

# extracted text, confirms content actually made it into the pdf
gs -q -dNOPAUSE -dBATCH -sDEVICE=txtwrite -o out.txt file.pdf

# render page 1 to png for a visual check
gs -q -dNOPAUSE -dBATCH -dFirstPage=1 -dLastPage=1 \
   -sDEVICE=png16m -r100 -o page1.png file.pdf
```

a clean build means zero lines starting with `!` in the log, and ideally no `LaTeX Warning` or `Overfull \hbox` lines.

# 6. clean up build artefacts

```bash
rm -f *.aux *.log *.out *.toc
```

these are never committed. if you forget, they appear as untracked files and must not be staged.

# 7. relationship to the site

`_config.yml` excludes every `.tex` source, so github pages publishes only the pdfs. push the rebuilt pdf alongside the `.tex`, or the download link keeps serving the old one:

https://zuck30.github.io/zuck30/profile/shadrack-profile.pdf

# 8. troubleshooting

<table align="center">
  <tr><td><strong>symptom</strong></td><td><strong>cause and fix</strong></td></tr>
  <tr><td><code>Page 1 of ??</code> in the footer</td><td>only one pass ran, run it three times</td></tr>
  <tr><td>empty table of contents</td><td>same cause, <code>.toc</code> is written on pass 1</td></tr>
  <tr><td><code>Undefined control sequence</code> on <code>\faMobileAlt</code></td><td>that icon does not exist in this fontawesome5, use <code>\faMobile</code></td></tr>
  <tr><td>text vanishing across pages</td><td>malformed tcolorbox key such as <code>title={..]}</code>, use <code>title={{..}}</code></td></tr>
  <tr><td><code>There's no line here to end</code></td><td>a <code>\\</code> immediately after <code>\end{center}</code></td></tr>
  <tr><td>font not loadable</td><td>font package missing from tex live, check <code>kpsewhich name.sty</code></td></tr>
  <tr><td>overfull hbox on long urls</td><td>accept it, or add <code>\setlength{\emergencystretch}{1.5em}</code></td></tr>
  <tr><td>site still shows the old pdf</td><td>pdf not committed or pushed, or github pages has not finished deploying</td></tr>
</table>
