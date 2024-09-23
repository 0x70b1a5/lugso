---
title: Home
order: 1
permalink: /
---

_... of the blood of the gods of the thoughts of the blood of the gods of the..._

Lugso is a language for eldritch cultists. Its full name is incapable of being written, since it is infinite - _of the blood of the gods of the thoughts of the blood of the gods of the thoughts..._ - but "lugso" (of the blood) will suffice for our purposes, since it is written almost exclusively _in_ blood.

![Our Father in Lugso](/assets/lugso-our-father.png)

## Lessons

{% assign rages = site.pages | sort: 'order' %}
<ol>{% for page in rages %}{% if page.title and page.hide != true and page.title != 'Home' %}
<li>
<a href="{{ page.url | relative_url }}">{{ page.title }}</a>
</li>
{% endif %}{% endfor %}</ol>
