$certContentBytes = Get-Content 'cert.pfx' -AsByteStream
[System.Convert]::ToBase64String($certContentBytes) | Out-File 'pfx-base64.txt'