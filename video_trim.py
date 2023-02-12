from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_subclip
import xlrd
# Give the location of the file 
loc = ("D:\\INR_Research\\segmentation\\lupa.xlsx") 
D = "D:\\INR_Research\\original_videos\\"
s_d="D:\\INR_Research\\task_image\\"
s_v="D:\\INR_Research\\task_videos4\\"
# To open Workbook 
wb = xlrd.open_workbook(loc) 
sheet = wb.sheet_by_index(0) 
##for tamim
#for i in range (sheet.nrows-1) :  
# #   i=0
#    filename=sheet.cell_value(i+1, 5) +'.mov'
#    start_time=sheet.cell_value(i+1,3) 
#    end_time=sheet.cell_value(i+1, 4) 
#    ffmpeg_extract_subclip(D+filename, start_time, end_time+1, targetname=s_v+str(i+392)+filename)
    
 ##for setor  
for i in range (sheet.nrows-1) :  
 #   i=0
    filename=sheet.cell_value(i+1, 5)
    start_time=sheet.cell_value(i+1,3) 
    end_time=sheet.cell_value(i+1, 4) 
    ffmpeg_extract_subclip(D+filename, start_time, end_time+1, targetname=s_v+str(i+423)+filename)
    