Add-Type -AssemblyName System.Drawing

# 花色名称映射
$colorNames = @{
    # 第1批 (1-9)
    "1_1" = "梵色海豹"
    "1_2" = "梵色巧克力"
    "1_3" = "梵色火焰"
    "1_4" = "双色海豹"
    "1_5" = "双色巧克力"
    "1_6" = "双色火焰"
    "1_7" = "手套海豹"
    "1_8" = "手套巧克力"
    "1_9" = "手套火焰"
    
    # 第2批 (10-18)
    "2_1" = "重点色海豹"
    "2_2" = "重点色巧克力"
    "2_3" = "重点色火焰"
    "2_4" = "山猫梵色海豹"
    "2_5" = "山猫梵色巧克力"
    "2_6" = "山猫梵色火焰"
    "2_7" = "山猫双色海豹"
    "2_8" = "山猫双色巧克力"
    "2_9" = "山猫双色火焰"
    
    # 第3批 (19-27)
    "3_1" = "山猫手套海豹"
    "3_2" = "山猫手套巧克力"
    "3_3" = "山猫手套火焰"
    "3_4" = "山猫重点色海豹"
    "3_5" = "山猫重点色巧克力"
    "3_6" = "山猫重点色火焰"
    "3_7" = "翎毛梵色海豹"
    "3_8" = "翎毛梵色巧克力"
    "3_9" = "翎毛梵色火焰"
    
    # 第4批 (28-36)
    "4_1" = "翎毛双色海豹"
    "4_2" = "翎毛双色巧克力"
    "4_3" = "翎毛双色火焰"
    "4_4" = "翎毛手套海豹"
    "4_5" = "翎毛手套巧克力"
    "4_6" = "翎毛手套火焰"
    "4_7" = "翎毛重点色海豹"
    "4_8" = "翎毛重点色巧克力"
    "4_9" = "翎毛重点色火焰"
    
    # 第5批 (37-45)
    "5_1" = "山猫翎毛梵色海豹"
    "5_2" = "山猫翎毛梵色巧克力"
    "5_3" = "山猫翎毛梵色火焰"
    "5_4" = "山猫翎毛双色海豹"
    "5_5" = "山猫翎毛双色巧克力"
    "5_6" = "山猫翎毛双色火焰"
    "5_7" = "山猫翎毛手套海豹"
    "5_8" = "山猫翎毛手套巧克力"
    "5_9" = "山猫翎毛手套火焰"
    
    # 第6批 (46-48)
    "6_1" = "山猫翎毛重点色海豹"
    "6_2" = "山猫翎毛重点色巧克力"
    "6_3" = "山猫翎毛重点色火焰"
    "6_4" = "未知花色"
    "6_5" = "未知花色"
    "6_6" = "未知花色"
    "6_7" = "未知花色"
    "6_8" = "未知花色"
    "6_9" = "未知花色"
}

function Crop-Images {
    param (
        [string]$sourcePath,
        [string]$outputFolder,
        [int]$gridX = 3,
        [int]$gridY = 3
    )
    
    # 确保输出文件夹存在
    if (-not (Test-Path $outputFolder)) {
        New-Item -Path $outputFolder -ItemType Directory | Out-Null
    }
    
    # 处理源图像
    $sourceImage = [System.Drawing.Image]::FromFile($sourcePath)
    
    # 计算每个单元格的尺寸
    $cellWidth = [int]($sourceImage.Width / $gridX)
    $cellHeight = [int]($sourceImage.Height / $gridY)
    
    # 获取批次编号（文件名）
    $batchNum = [System.IO.Path]::GetFileNameWithoutExtension($sourcePath)
    
    # 裁剪图像
    $cellIndex = 1
    for ($y = 0; $y -lt $gridY; $y++) {
        for ($x = 0; $x -lt $gridX; $x++) {
            # 定义裁剪区域
            $rect = New-Object System.Drawing.Rectangle($x * $cellWidth, $y * $cellHeight, $cellWidth, $cellHeight)
            
            # 创建裁剪后的图像
            $croppedImage = New-Object System.Drawing.Bitmap($cellWidth, $cellHeight)
            $graphics = [System.Drawing.Graphics]::FromImage($croppedImage)
            $graphics.DrawImage($sourceImage, (New-Object System.Drawing.Rectangle(0, 0, $cellWidth, $cellHeight)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
            $graphics.Dispose()
            
            # 生成输出文件名
            $colorKey = "${batchNum}_${cellIndex}"
            $colorName = $colorNames[$colorKey]
            if (-not $colorName) {
                $colorName = "未知花色_${batchNum}_${cellIndex}"
            }
            $outputFile = Join-Path $outputFolder "$colorName.png"
            
            # 保存裁剪后的图像
            $croppedImage.Save($outputFile, [System.Drawing.Imaging.ImageFormat]::Png)
            $croppedImage.Dispose()
            
            $cellIndex++
        }
    }
    
    # 释放资源
    $sourceImage.Dispose()
    
    Write-Host "已完成图片 $sourcePath 的裁剪，输出到 $outputFolder"
}

# 处理所有图片
$imageFolder = "."
$outputFolder = ".\cropped"

Get-ChildItem -Path $imageFolder -Filter "*.png" | ForEach-Object {
    if ($_.Name -match "^\d+\.png$") {
        Write-Host "正在处理图片: $($_.FullName)"
        Crop-Images -sourcePath $_.FullName -outputFolder $outputFolder
    }
}

Write-Host "所有图片处理完成！" 