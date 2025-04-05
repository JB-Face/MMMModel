from PIL import Image
import os

# 创建输出目录
output_dir = "cropped_cats"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# 定义所有花色名称
color_patterns = {
    # 第1组 (1-9)
    "1_1": "梵色海豹",
    "1_2": "梵色巧克力",
    "1_3": "梵色火焰",
    "1_4": "双色海豹",
    "1_5": "双色巧克力",
    "1_6": "双色火焰",
    "1_7": "手套海豹",
    "1_8": "手套巧克力",
    "1_9": "手套火焰",
    
    # 第2组 (10-18)
    "2_1": "重点色海豹",
    "2_2": "重点色巧克力",
    "2_3": "重点色火焰",
    "2_4": "山猫梵色海豹",
    "2_5": "山猫梵色巧克力",
    "2_6": "山猫梵色火焰",
    "2_7": "山猫双色海豹",
    "2_8": "山猫双色巧克力",
    "2_9": "山猫双色火焰",
    
    # 第3组 (19-27)
    "3_1": "山猫手套海豹",
    "3_2": "山猫手套巧克力",
    "3_3": "山猫手套火焰",
    "3_4": "山猫重点色海豹",
    "3_5": "山猫重点色巧克力",
    "3_6": "山猫重点色火焰",
    "3_7": "翎毛梵色海豹",
    "3_8": "翎毛梵色巧克力",
    "3_9": "翎毛梵色火焰",
    
    # 第4组 (28-36)
    "4_1": "翎毛双色海豹",
    "4_2": "翎毛双色巧克力",
    "4_3": "翎毛双色火焰",
    "4_4": "翎毛手套海豹",
    "4_5": "翎毛手套巧克力",
    "4_6": "翎毛手套火焰",
    "4_7": "翎毛重点色海豹",
    "4_8": "翎毛重点色巧克力",
    "4_9": "翎毛重点色火焰",
    
    # 第5组 (37-45)
    "5_1": "山猫翎毛梵色海豹",
    "5_2": "山猫翎毛梵色巧克力",
    "5_3": "山猫翎毛梵色火焰",
    "5_4": "山猫翎毛双色海豹",
    "5_5": "山猫翎毛双色巧克力",
    "5_6": "山猫翎毛双色火焰",
    "5_7": "山猫翎毛手套海豹",
    "5_8": "山猫翎毛手套巧克力",
    "5_9": "山猫翎毛手套火焰",
    
    # 第6组 (46-48 + 额外花色)
    "6_1": "山猫翎毛重点色海豹",
    "6_2": "山猫翎毛重点色巧克力",
    "6_3": "山猫翎毛重点色火焰",
    "6_4": "玳瑁",
    "6_5": "三花",
    "6_6": "银虎斑",
    "6_7": "丁香重点色",
    "6_8": "蓝重点色",
    "6_9": "传统暹罗色"
}

def crop_image(image_path, grid_size=(3, 3)):
    """
    切割图片为grid_size指定的网格大小，并返回所有切片
    """
    try:
        # 打开图片
        img = Image.open(image_path)
        
        # 获取图片尺寸和切片尺寸
        width, height = img.size
        slice_width = width // grid_size[0]
        slice_height = height // grid_size[1]
        
        # 存储所有切片
        slices = []
        
        # 批次号（从文件名中提取）
        batch_num = os.path.basename(image_path).split('.')[0]
        
        # 切割图片
        index = 1
        for y in range(grid_size[1]):
            for x in range(grid_size[0]):
                # 计算切片区域
                left = x * slice_width
                upper = y * slice_height
                right = left + slice_width
                lower = upper + slice_height
                
                # 切割
                slice_img = img.crop((left, upper, right, lower))
                
                # 获取对应的花色名称
                color_key = f"{batch_num}_{index}"
                color_name = color_patterns.get(color_key, f"未知花色_{color_key}")
                
                # 保存切片
                save_path = os.path.join(output_dir, f"{color_name}.png")
                slice_img.save(save_path)
                print(f"已保存: {save_path}")
                
                slices.append((slice_img, color_name))
                index += 1
        
        print(f"图片 {image_path} 已成功切割为 {len(slices)} 个切片")
        return slices
    
    except Exception as e:
        print(f"处理图片 {image_path} 时出错: {e}")
        return []

def main():
    """
    主函数，处理1.png到6.png的所有图片
    """
    print("开始处理猫咪花色图片...")
    
    # 处理所有图片
    for i in range(1, 7):
        image_path = f"{i}.png"
        if os.path.exists(image_path):
            print(f"正在处理图片: {image_path}")
            crop_image(image_path)
        else:
            print(f"找不到图片: {image_path}")
    
    print(f"所有图片处理完成! 切割后的图片已保存到 {output_dir} 目录")

if __name__ == "__main__":
    main() 