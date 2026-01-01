# Set correct permissions for SSH private key on Windows
# Run this in PowerShell

$sshKeyPath = "$env:USERPROFILE\.ssh\id_ed25519"

if (Test-Path $sshKeyPath) {
    # Remove inheritance and remove all access rules
    $acl = Get-Acl $sshKeyPath
    $acl.SetAccessRuleProtection($true, $false)
    
    # Grant full control to current user only
    $permission = $env:USERNAME, "FullControl", "Allow"
    $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
    $acl.SetAccessRule($accessRule)
    
    # Apply the ACL
    Set-Acl $sshKeyPath $acl
    
    Write-Host "✅ SSH key permissions set correctly" -ForegroundColor Green
    Write-Host "   Only $env:USERNAME has access to the private key"
} else {
    Write-Host "❌ SSH key not found at: $sshKeyPath" -ForegroundColor Red
    Write-Host "   Your key might be named differently (id_rsa, id_ecdsa, etc.)"
}

