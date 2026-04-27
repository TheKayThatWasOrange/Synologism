# Synologism

Let's pretend we believe that Synology makes some NAS systems of acceptable quality for casual home users who are not  sperglord stepdads running 40,000 absolutely useless Docker containers to host their voluminous pony porn collections in what they call a "homelab" to cover their shame. With that out of the way, we can still assert that Synology engineers don't have all that firm of a grasp on what makes a good UI and we may find ourselves wishing that one or more of their "Packages" could be modified in some way that would make it less irritating for our particular use case.

Every Harry Denton home invader on Reddit will tell you that you can't mess with any of the built-in software without blowing up your house and killing a million people but you actually kind of can. Synology Packages are not code signed in any way and while I have no idea how to re-build them after de-minimizing their Vue code, it's pretty easy to inject new code into them and either supplement or counteract the behaviors which you do not like.

Most Synology Packages with a meaningful UI are going to have an HTML file somewhere at the top of their directory structure which serves to bootstrap the entire application. Plop some links to external JS or CSS into this file and Bob's your uncle.

In my case, I wanted to make Surveillance Station's alert system less obnoxious by disabling all of the map animations it performs and all of the blinking red shit it throws all over the screen. Simply SSH into the NAS and:

`sudo vim /var/packages/SurveillanceStation/target/ui/desktop.html`

What you see there will likely vary depending on the version of Surveillance Station you have installed, but it should be a pretty short file that is easily navigable like this:

```
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE={IE_MODE}" />
<meta name="msapplication-TileImage" content="resources/images/icon_tile.png?v=4398" />
<meta name="application-name" content="{TITLE}" />
<meta name="msapplication-TileColor" content="#246BB3"/>
<meta name="description" content="{SITE_DESCRIPTION}" />
<meta name="keywords" content="{SITE_KEYWORDS}" />
<link rel="shortcut icon" href="{FAVICON}" />
<link rel="shortcut icon" href="{FAVICON16}" sizes="16x16"/>
<link rel="shortcut icon" href="{FAVICON64}" sizes="64x64"/>
<link rel="shortcut icon" href="{FAVICON48}" sizes="48x48"/>
<link rel="shortcut icon" href="{FAVICON32}" sizes="32x32"/>
<title>{TITLE}</title>
{CSS}
</head>
<body>
<div id="div_probe_plugin_hidden" style="position:absolute; left:-100px;"></div>
<div id="div_helper_hidden" style="position:absolute; left:-100px;"></div>
<div id="div_joystick_player" style="position:absolute; left:-100px;"></div>
<div id="div_audioin_plugin" style="position:absolute; left:-100px;"></div>
<img id="sds-wallpaper" />
{JSFILE}
<div class="pre-load-x-window-br"></div>
<div id="virtual-mouse-cursor" style="visibility:hidden"></div>
</body>
</html>
```

It's pretty easy to see that if you add something around those `{CSS}` and `{JSFILE}` template injection points it's gonna load, so just throw some CSS/JS on a server that is accessible to the machines that will be interacting with Surveillance Station like so:

```
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE={IE_MODE}" />
<meta name="msapplication-TileImage" content="resources/images/icon_tile.png?v=4398" />
<meta name="application-name" content="{TITLE}" />
<meta name="msapplication-TileColor" content="#246BB3"/>
<meta name="description" content="{SITE_DESCRIPTION}" />
<meta name="keywords" content="{SITE_KEYWORDS}" />
<link rel="shortcut icon" href="{FAVICON}" />
<link rel="shortcut icon" href="{FAVICON16}" sizes="16x16"/>
<link rel="shortcut icon" href="{FAVICON64}" sizes="64x64"/>
<link rel="shortcut icon" href="{FAVICON48}" sizes="48x48"/>
<link rel="shortcut icon" href="{FAVICON32}" sizes="32x32"/>
<title>{TITLE}</title>
{CSS}

<!-- BOOM -->
<link rel="stylesheet" type="text/css" href="http://harlock.piss:8080/synology/injected.css">

</head>
<body>
<div id="div_probe_plugin_hidden" style="position:absolute; left:-100px;"></div>
<div id="div_helper_hidden" style="position:absolute; left:-100px;"></div>
<div id="div_joystick_player" style="position:absolute; left:-100px;"></div>
<div id="div_audioin_plugin" style="position:absolute; left:-100px;"></div>
<img id="sds-wallpaper" />
{JSFILE}

<!-- BOOM -->
<script src="http://harlock.piss:8080/synology/injected.js" defer></script>

<div class="pre-load-x-window-br"></div>
<div id="virtual-mouse-cursor" style="visibility:hidden"></div>
</body>
</html>
```

And now you can tail patch (almost) anything Synology does that you don't like. You obviously cannot add new video codecs to the compiled binaries in the Package, but you can twiddle with the UI to your heart's content.

You may not like any of the example hacks in these files, but they should hopefully illustrate just how painfully wrong all the Reddit gentlesirs are.

Open the door, please.




