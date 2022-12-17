---
layout: post
tags: programming, devops, ansible, qemu, virtualization
---

In this article, you will learn how to run a cloud VM locally.
We'll achieve this by pulling an image and spinning it up using [QEMU](https://www.qemu.org/).

1. [Install requirements](#setup-environment)
2. [Select a base image](#select-a-base-image)
3. [Configure the system](#configure-the-system)
4. [Add a throwaway layer](#add-a-throwaway-layer)
5. [Start the machine](#start-the-machine)
6. [Run Ansible](#run-ansible)

## Setup environment

For a Linux distribution like Debian or Ubuntu, you can install QEMU and required tools like this:

```bash
sudo apt update && sudo apt install -y qemu-system-x86 cloud-utils
```

Let's also create a cache directory to persist our progress on disk:

```bash
mkdir -p ".qemu"
```

## Select a base image

Now go and fetch yourself a cloudinit VM image.
As of writing this post, you can download the latest Ubuntu version onto your machine like so:

```bash
curl -L "https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img" > ".qemu/base.img"
```

> You can also check [cloud-images.ubuntu.com](https://cloud-images.ubuntu.com/) for more image variants.

## Configure the system

[Cloudinit](https://cloud-init.io/) is a standardized way of pre-configuring VMs in the cloud.
For our local setup, we'll configure a seed image with a default user.

```bash
cat > ".qemu/metadata.yaml" <<EOF
instance-id: iid-local01
local-hostname: cloudimg
EOF

cat > ".qemu/user-data.yaml" <<EOF
#cloud-config
groups:
    - $(whoami)

users:
    - name: $(whoami)
      gecos: $(whoami)
      primary_group: $(whoami)
      groups: users, admin, adm
      sudo: ALL=(ALL) NOPASSWD:ALL
      lock_passwd: true
      shell: /bin/bash
      ssh_authorized_keys:
        - $(cat ~/.ssh/id_rsa.pub)

system_info:
  default_user:
    name: $(whoami)

EOF

cloud-localds ".qemu/vm-seed.img" ".qemu/user-data.yaml" ".qemu/metadata.yaml"
```

## Add a throwaway layer

By default, QEMU will update the given images on disk unless you provide some smart parameters.
There is an easier way to ensure isolation, however.
For this reason, you can create a copy-on-write image that acts as a middleware between your chosen base image and the VM's state:

```bash
qemu-img create -b ".qemu/base.img" ".qemu/vm-data.img" -f qcow2 -F qcow2
```

## Start the machine

After setting up the data and seed layers, we can spawn our VM:

```bash
qemu-system-x86_64 \
    -machine accel=kvm,type=q35 -cpu host -m 2G \
    -nographic -serial mon:stdio \
    -device virtio-net-pci,netdev=net0 \
    -netdev user,id=net0,hostfwd=tcp::2222-:22,hostfwd=tcp::8080-:80,hostfwd=tcp::8443-:443 \
    -drive if=virtio,format=qcow2,file=".qemu/vm-data.img" \
    -drive if=virtio,format=raw,file=".qemu/vm-seed.img"
```

## Run Ansible

Congratulations - you may test your VM now!
I like to use Ansible for automating my server setup:

```bash
pip3 install ansible
ansible -i configure.yml
```