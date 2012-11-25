class window.Archive.TAR
  parse: (buffer) ->
    uint8 = new Uint8Array buffer
    pos = 0
    while pos < buffer.byteLength
      name = ""

      for i in [pos..pos + 99] when uint8[i] != 0
        name += String.fromCharCode(uint8[i])

      if name.length == 0 then break

      size = ""
      size += String.fromCharCode(uint8[i]) for i in [pos + 124..pos + 135] by 1

      mtime = ""
      mtime += String.fromCharCode(uint8[i]) for i in [pos + 136..pos + 147] by 1
      pos += 512

      size = parseInt size.replace(/^[0]+/g, ""), 8

      content = buffer.slice(pos, (pos += size))

      pos += 512 - (pos % 512)
      new window.Archive.File(name, content)
