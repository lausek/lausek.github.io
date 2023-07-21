---
layout: post
tags: ubuntu, db, deutsche, bahn, ice
---

When I first tried working on ICE to Hamburg from my laptop, I couldn't reach the wifi login page.
It was able to connect though so the issue must be somewhere deeper.
I'm on Ubuntu 22.04 and here's how I solved it.

# Check the IP

We can check that our device got an IP address assigned by running `ip -4 addr`.
You'll see something along the lines of:

```
1: lo: ...
2: wlp0s20f3: ... UP ...
    inet <your-ip-address> brd 172.18.255.255 ...
3: br-2d004261a670: ...
    inet 172.19.0.1/16 ...
4: br-380a59df812e: ...
    inet 172.18.0.1/16 ...
5: docker0: ...
    inet 172.18.0.1/16 ...
```

The `wlp0s20f3` interface has an IP address but the default gateway collides with networks created by the docker daemon.

# Change the docker address range

We need to move docker and the created bridges out of the way.
This can be done by editing the `/etc/docker/daemon.json` file.
If it's not there yet, create it with this content:

```json
{
	"bip": "172.26.0.1/16"
}
```

Try `sudo service docker restart` afterwards.
If the IP address of docker did not change, restart your device and let me know. 😁

# Cleanup the old interfaces

You've probably noticed that the `br-xxxx` devices are still there.
Let's remove them with this command:

```bash
sudo docker network prune
```

# Open the wifi login page

Now go to [wifionice.de](https://www.wifionice.de) or [bahn.de](https://bahn.de).
It should work now! 🎉
