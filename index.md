---
title: Home
order: 1
permalink: /
---

_... of the blood of the gods of the thoughts of the blood of the gods of the..._

Lugso is a language for eldritch cultists. Its full name is incapable of being written, since it is infinite - **lugso guSliibso sotibso lugso guSliibso sotibso lugso guSliibso sotibso...** `blood-GEN sentient-SUPER-PL-GEN thought-PL-GEN` _of the blood of the gods of the thoughts of the blood of the gods of the thoughts..._ - but "lugso" (of the blood) will suffice for our purposes, since it is written almost exclusively _in_ blood - and you cannot exhaustively write an infinite series, anyway!

**fhtognizit ivol rkior vgov supnSuv fhtognsuTrin vgov itgibzki olnriS sin yiy.**

`dead-NEG DET.DIST abide-REL can eternity-ADV.DER sleep-FFUT-CONJ.and can aeon-PL-TEMP strange death EMPH`

_That is not dead which can eternal lie, and with strange aeons even death may die._

## Lessons

{% assign rages = site.pages | sort: 'order' %}
<ol>{% for page in rages %}{% if page.title and page.hide != true and page.title != 'Home' %}
<li>
<a href="{{ page.url | relative_url }}">{{ page.title }}</a>
</li>
{% endif %}{% endfor %}</ol>
