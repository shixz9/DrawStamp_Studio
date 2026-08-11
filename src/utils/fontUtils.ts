import { LOCAL_FONT_CANDIDATES, LOCAL_FONT_DISPLAY_NAMES } from './localFontCandidates'

const fontAliases: Record<string, string> = {  '华文隶书': 'STLiti',
  '隶书': 'LiSu',
  '隶书 (GB2312)': 'SimLi',
  '隶书 GB2312': 'SimLi',
  '宋体': 'SimSun',
  '黑体': 'SimHei',
  '楷体': 'KaiTi',
  '仿宋': 'FangSong',
  '微软雅黑': 'Microsoft YaHei',
  '苹方': 'PingFang SC',
  '华文宋体': 'STSong',
  '华文楷体': 'STKaiti',
  '华文黑体': 'STHeiti',
  '华文仿宋': 'STFangsong',
  '华文行楷': 'STXingkai',
  '华文新魏': 'STXinwei',
  'ST Liti': 'STLiti',
  '方正小标宋': 'FZXiaoBiaoSong-B05S',
  '方正小标宋体': 'FZXiaoBiaoSong-B05S',
  '方正小标宋简': 'FZXiaoBiaoSong-B05S',
  '方正小标宋简体': 'FZXiaoBiaoSong-B05S',
  '反正小标宋': 'FZXiaoBiaoSong-B05S',
  '反正小标宋体': 'FZXiaoBiaoSong-B05S',
  '小标宋': 'FZXiaoBiaoSong-B05S',
  'FZXBSJW--GB1-0': 'FZXiaoBiaoSong-B05S'
}

const fontFallbacks: Record<string, string[]> = {
  STLiti: ['DrawStamp-STLiti', 'STLiti', '华文隶书', 'ST Liti', 'LiSu', '隶书', 'Libian SC', 'serif'],
  LiSu: ['DrawStamp-STLiti', 'LiSu', '隶书', 'STLiti', '华文隶书', 'Libian SC', 'serif'],
  SimLi: ['DrawStamp-STLiti', 'SimLi', '隶书', 'LiSu', 'STLiti', '华文隶书', 'serif'],
  SimSun: ['SimSun', '宋体', 'Songti SC', 'serif'],
  SimHei: ['SimHei', '黑体', 'Heiti SC', 'sans-serif'],
  KaiTi: ['KaiTi', '楷体', 'Kaiti SC', 'STKaiti', 'serif'],
  KaiTi_GB2312: ['KaiTi_GB2312', '楷体_GB2312', 'KaiTi', '楷体', 'Kaiti SC', 'serif'],
  FangSong: ['FangSong', '仿宋', 'STFangsong', 'serif'],
  FangSong_GB2312: ['FangSong_GB2312', '仿宋_GB2312', 'FangSong', '仿宋', 'serif'],
  'Songti SC': ['Songti SC', 'STSong', 'SimSun', '宋体', 'serif'],
  'Kaiti SC': ['Kaiti SC', 'STKaiti', 'KaiTi', '楷体', 'serif'],
  'Heiti SC': ['Heiti SC', 'STHeiti', 'SimHei', '黑体', 'sans-serif'],
  'Microsoft YaHei': ['Microsoft YaHei', '微软雅黑', 'PingFang SC', 'sans-serif'],
  'PingFang SC': ['PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
  'FZXiaoBiaoSong-B05S': ['FZXiaoBiaoSong-B05S', 'FZXBSJW--GB1-0', '方正小标宋简体', '方正小标宋体', '方正小标宋简', 'SimSun', 'Songti SC', 'serif']
}

export function getCanonicalFontName(fontName: string): string {
  const trimmed = fontName.trim()
  return fontAliases[trimmed] || trimmed
}

function quoteFontFamily(fontName: string): string {
  if (/^(serif|sans-serif|monospace|cursive|fantasy|system-ui)$/i.test(fontName)) {
    return fontName
  }
  const escaped = fontName.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  return `"${escaped}"`
}

export function getFontCssFamily(fontName: string): string {
  const canonical = getCanonicalFontName(fontName)
  const stack = fontFallbacks[canonical] || [canonical, 'SimSun', 'Songti SC', 'serif']
  return Array.from(new Set(stack.filter(Boolean))).map(quoteFontFamily).join(', ')
}

export function getCanvasFontString(
  fontName: string,
  fontSizePx: number,
  fontWeight: string | number = 'normal',
  fontStyle: string = 'normal'
): string {
  return `${fontStyle} ${fontWeight} ${fontSizePx}px ${getFontCssFamily(fontName)}`
}

export async function ensureStampFontsLoaded(): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return

  try {
    await Promise.all([
      document.fonts.load('16px "DrawStamp-STLiti"'),
      document.fonts.load('16px "STLiti"'),
      document.fonts.load('16px "FZXiaoBiaoSong-B05S"'),
      document.fonts.ready
    ])
  } catch (error) {
    console.warn('Stamp fonts failed to preload:', error)
  }
}

// 字体名称映射：英文字体名称 -> 中文显示名称
export function getFontDisplayName(fontName: string): string {
  const canonicalName = getCanonicalFontName(fontName)
  // 本机字体别名(PostScript/拉丁名) -> 首选中文名
  const localDisplay = LOCAL_FONT_DISPLAY_NAMES[canonicalName] || LOCAL_FONT_DISPLAY_NAMES[fontName]
  if (localDisplay) return localDisplay
  const fontNameMap: Record<string, string> = {
    // GB2312 国标字体
    'SimSun': '宋体 (GB2312)',
    'SimHei': '黑体 (GB2312)',
    'KaiTi': '楷体',
    'KaiTi_GB2312': '楷体 (GB2312)',
    'FangSong': '仿宋',
    'FangSong_GB2312': '仿宋 (GB2312)',
    'SimLi': '隶书 (GB2312)',
    'NSimSun': '新宋体 (GB2312)',
    'Songti SC': '宋体-简',
    'Kaiti SC': '楷体-简',
    'Heiti SC': '黑体-简',
    'PingFang SC': '苹方-简',
    'PingFang TC': '苹方-繁',
    'PingFang HK': '苹方-港',
    'Songti TC': '宋体-繁',
    'Kaiti TC': '楷体-繁',
    'Heiti TC': '黑体-繁',
    'Yuanti SC': '圆体-简',
    'Yuanti TC': '圆体-繁',
    'Xingkai SC': '行楷-简',
    'Xingkai TC': '行楷-繁',
    'Baoli SC': '报隶-简',
    'Weibei SC': '魏碑-简',
    'Weibei TC': '魏碑-繁',
    'Libian SC': '隶变-简',
    'Libian TC': '隶变-繁',
    'Wawati SC': '娃娃体-简',
    'Wawati TC': '娃娃体-繁',
    'Lantinghei SC': '兰亭黑-简',
    'Lantinghei TC': '兰亭黑-繁',
    'Hannotate SC': '手札体-简',
    'Hannotate TC': '手札体-繁',
    'HanziPen SC': '翩翩体-简',
    'HanziPen TC': '翩翩体-繁',
    'Yuppy SC': '雅痞-简',
    'Yuppy TC': '雅痞-繁',
    'Hiragino Sans': '冬青黑体',
    'Hiragino Mincho ProN': '冬青明朝',
    'Hiragino Kaku Gothic ProN': '冬青角黑',
    'Hiragino Maru Gothic ProN': '冬青丸黑',
    'Apple LiGothic': '苹果俪中黑',
    'Apple LiSung': '苹果俪细宋',
    'LiHei Pro': '俪黑 Pro',
    'LiSong Pro': '俪宋 Pro',
    'Hiragino Sans GB': '冬青黑体简体中文',
    
    // 常用中文字体
    'Microsoft YaHei': '微软雅黑',
    'LiSu': '隶书',
    'YouYuan': '幼圆',
    
    // 华文字体系列
    'STHeiti': '华文黑体',
    'STKaiti': '华文楷体',
    'STSong': '华文宋体',
    'STFangsong': '华文仿宋',
    'STZhongsong': '华文中宋',
    'STXihei': '华文细黑',
    'STHupo': '华文琥珀',
    'STLiti': '华文隶书',
    'STXingkai': '华文行楷 (书法)',
    'STXinwei': '华文新魏 (书法)',
    'STCaiyun': '华文彩云',
    // 篆书字体（如果系统已安装）
    'FZZhuan': '方正篆书',
    'HYZhuan': '汉仪篆书',
    'STZhuan': '华文篆书',
    'ZhuanShu': '篆书',
    'FZKai-Z03': '方正楷体',
    'FZLiShu-S01': '方正隶书',
    'FZXiaoZhuanTi-S13T': '方正小篆体',
    'FZXiaoBiaoSong-B05S': '方正小标宋简体',
    'FZXBSJW--GB1-0': '方正小标宋简体',
    'HYLiShuJ': '汉仪隶书',
    'HYZhongLiShuJ': '汉仪中隶书',
    'HYYanKaiW': '汉仪颜楷',
    'HYSongYunLangHeiW': '汉仪松韵朗黑',
    
    // 方正字体系列
    'FZShuTi': '方正舒体',
    'FZYaoti': '方正姚体',
    'FZHei-B01S': '方正黑体',
    'FZKai-Z03S': '方正楷体',
    'FZSong': '方正宋体',
    
    // 其他中文字体
    'PMingLiU': '新细明体',
    'MingLiU': '细明体',
    'DFKai-SB': '标楷体',
    'BiauKai': '标楷体',
    'Microsoft JhengHei': '微软正黑体',
    'Microsoft JhengHei UI': '微软正黑体 UI',
    'Microsoft YaHei UI': '微软雅黑 UI',
    'STSongti-SC-Regular': '华文宋体-简',
    'STHeiti-SC-Regular': '华文黑体-简',
    'STKaiti-SC-Regular': '华文楷体-简',
    'STFangsong-SC-Regular': '华文仿宋-简',
    'STSongti-SC-Light': '华文宋体-简-细',
    'STHeiti-SC-Light': '华文黑体-简-细',
    'STKaiti-SC-Light': '华文楷体-简-细',
    'WenQuanYi Micro Hei': '文泉驿微米黑',
    'WenQuanYi Zen Hei': '文泉驿正黑',
    'Noto Sans CJK SC': '思源黑体-简',
    'Source Han Sans SC': '思源黑体-简',
    'Source Han Sans CN': '思源黑体-简',
    'Source Han Serif SC': '思源宋体-简',
    'Source Han Serif CN': '思源宋体-简',
    'Noto Serif CJK SC': '思源宋体-简',
    'DengXian': '等线',
    'DengXian Light': '等线 Light',
    'Microsoft YaHei Light': '微软雅黑 Light',
    'Microsoft YaHei Bold': '微软雅黑 Bold',
    'SimSun-ExtB': '宋体-扩展B',
    
    // 常用英文字体（保持英文名称）
    'Arial': 'Arial',
    'Times New Roman': 'Times New Roman',
    'Helvetica': 'Helvetica',
    'Courier New': 'Courier New',
    'Verdana': 'Verdana',
    'Georgia': 'Georgia',
    'Tahoma': 'Tahoma',
    'Trebuchet MS': 'Trebuchet MS',
    'Comic Sans MS': 'Comic Sans MS',
    'Impact': 'Impact',
    'Lucida Console': 'Lucida Console',
    'Lucida Sans Unicode': 'Lucida Sans Unicode',
    'Palatino Linotype': 'Palatino Linotype',
    'Garamond': 'Garamond',
    'Bookman Old Style': 'Bookman Old Style',
    'Century Gothic': 'Century Gothic',
    'Franklin Gothic Medium': 'Franklin Gothic Medium'
  };
  
  return fontNameMap[canonicalName] || fontNameMap[fontName] || fontName;
}

export type FontCategory = 'stamp' | 'song' | 'hei' | 'kai' | 'english' | 'system'

export function getRecommendedStampFonts(): string[] {
  return [
    'SimSun',
    'Songti SC',
    'STSong',
    'FZXiaoBiaoSong-B05S',
    'KaiTi',
    'Kaiti SC',
    'STKaiti',
    'FangSong',
    'LiSu',
    'STLiti',
    'Arial'
  ]
}

export function getFontCategory(fontName: string): FontCategory {
  const canonicalName = getCanonicalFontName(fontName)
  const displayName = getFontDisplayName(canonicalName)
  const lowerName = `${canonicalName} ${displayName}`.toLowerCase()
  if (/lisu|liti|xingkai|xinwei|zhuan|shuti|yaoti|weibei|baoli|libian|隶书|行楷|新魏|篆|舒体|姚体|魏碑|报隶|隶变|隶|金文|瘦金|行书|草书|黄草|章草/i.test(`${canonicalName} ${displayName}`)) return 'stamp'
  if (/song|simsun|serif|ming|sung|mincho|宋|明/i.test(lowerName)) return 'song'
  if (/hei|sans|yahei|pingfang|dengxian|helvetica|arial|gothic|yuanti|黑|圆/i.test(lowerName)) return 'hei'
  if (/kai|fangsong|fang|wawati|hannotate|hanzipen|yuppy|楷|仿宋|娃娃|手札|翩翩|雅痞|丫丫|钢笔|毛笔|签名|手写/i.test(lowerName)) return 'kai'
  if (/times|courier|verdana|georgia|tahoma|impact|garamond|bookman|century|franklin/i.test(lowerName)) return 'english'
  // 纯 ASCII 名称默认归入英文/数字
  if (/^[\x20-\x7E]+$/.test(canonicalName)) return 'english'
  return 'system'
}

export function getFontCategoryLabel(category: FontCategory): string {
  const labels: Record<FontCategory, string> = {
    stamp: '印章推荐',
    song: '宋体/明体',
    hei: '黑体/现代',
    kai: '楷体/仿宋',
    english: '英文/数字',
    system: '系统字体'
  }
  return labels[category]
}

export function groupFontsByCategory(fonts: string[]): Array<{ category: FontCategory; label: string; fonts: string[] }> {
  const order: FontCategory[] = ['stamp', 'song', 'hei', 'kai', 'english', 'system']
  const uniqueFonts = Array.from(new Set(fonts.filter(Boolean)))
  const grouped = new Map<FontCategory, string[]>()

  uniqueFonts.forEach(font => {
    const category = getFontCategory(font)
    grouped.set(category, [...(grouped.get(category) || []), font])
  })

  return order
    .map(category => ({
      category,
      label: getFontCategoryLabel(category),
      fonts: (grouped.get(category) || []).sort((a, b) => getFontDisplayName(a).localeCompare(getFontDisplayName(b), 'zh-Hans-CN'))
    }))
    .filter(group => group.fonts.length > 0)
}

// 获取常用中文字体列表（包含GB2312等国标字体）
function getChineseFonts(): string[] {
  return [
    // GB2312 国标字体
    'SimSun', // 宋体 (GB2312)
    'SimHei', // 黑体 (GB2312)
    'KaiTi_GB2312', // 楷体_GB2312
    'FangSong_GB2312', // 仿宋_GB2312
    'SimLi', // 隶书 (GB2312)
    'NSimSun', // 新宋体 (GB2312)
    
    // 常用中文字体
    'Microsoft YaHei', // 微软雅黑
    'KaiTi', // 楷体
    'FangSong', // 仿宋
    'LiSu', // 隶书
    'YouYuan', // 幼圆
    
    // 华文字体系列
    'STHeiti', // 华文黑体
    'STKaiti', // 华文楷体
    'STSong', // 华文宋体
    'STFangsong', // 华文仿宋
    'STZhongsong', // 华文中宋
    'FZXiaoBiaoSong-B05S', // 方正小标宋简体
    'FZXBSJW--GB1-0', // 方正小标宋简体 PostScript 名称
    'STXihei', // 华文细黑
    'STHupo', // 华文琥珀
    'STLiti', // 华文隶书
    'STXingkai', // 华文行楷
    'STXinwei', // 华文新魏
    'STCaiyun', // 华文彩云
    // 篆书字体（如果系统已安装）
    'FZZhuan', // 方正篆书
    'HYZhuan', // 汉仪篆书
    'STZhuan', // 华文篆书
    'ZhuanShu', // 篆书
    'FZLiShu-S01', // 方正隶书
    'FZXiaoZhuanTi-S13T', // 方正小篆体
    'HYLiShuJ', // 汉仪隶书
    'HYZhongLiShuJ', // 汉仪中隶书
    'HYYanKaiW', // 汉仪颜楷
    
    // 方正字体系列
    'FZShuTi', // 方正舒体
    'FZYaoti', // 方正姚体
    'FZHei-B01S', // 方正黑体
    'FZKai-Z03S', // 方正楷体
    'FZSong', // 方正宋体
    
    // 其他中文字体
    'PMingLiU', // 新细明体
    'MingLiU', // 细明体
    'DFKai-SB', // 标楷体
    'BiauKai', // 标楷体
    'Microsoft JhengHei', // 微软正黑体
    'Microsoft JhengHei UI', // 微软正黑体 UI
    'Microsoft YaHei UI', // 微软雅黑 UI
    'STSongti-SC-Regular', // 华文宋体-简
    'STHeiti-SC-Regular', // 华文黑体-简
    'STKaiti-SC-Regular', // 华文楷体-简
    'STFangsong-SC-Regular', // 华文仿宋-简
    'Songti SC', // 宋体-简
    'Kaiti SC', // 楷体-简
    'Heiti SC', // 黑体-简
    'Songti TC', // 宋体-繁
    'Kaiti TC', // 楷体-繁
    'Heiti TC', // 黑体-繁
    'Yuanti SC', // 圆体-简
    'Xingkai SC', // 行楷-简
    'Baoli SC', // 报隶-简
    'Weibei SC', // 魏碑-简
    'Libian SC', // 隶变-简
    'STSongti-SC-Light', // 华文宋体-简-细
    'STHeiti-SC-Light', // 华文黑体-简-细
    'STKaiti-SC-Light', // 华文楷体-简-细
    'PingFang SC', // 苹方-简
    'Hiragino Sans GB', // 冬青黑体简体中文
    'WenQuanYi Micro Hei', // 文泉驿微米黑
    'WenQuanYi Zen Hei', // 文泉驿正黑
    'Noto Sans CJK SC', // 思源黑体-简
    'Noto Serif CJK SC', // 思源宋体-简
    'Source Han Sans SC', // 思源黑体-简
    'Source Han Sans CN', // 思源黑体-简
    'Source Han Serif SC', // 思源宋体-简
    'Source Han Serif CN', // 思源宋体-简
    'DengXian', // 等线
    'DengXian Light', // 等线 Light
    'Microsoft YaHei Light', // 微软雅黑 Light
    'Microsoft YaHei Bold', // 微软雅黑 Bold
    'SimSun-ExtB' // 宋体-扩展B
  ];
}

// macOS 系统自带中文字体（/System/Library/Fonts 与 /Library/Fonts）
function getMacOSChineseFonts(): string[] {
  return [
    'PingFang SC', // 苹方-简
    'PingFang TC', // 苹方-繁
    'PingFang HK', // 苹方-港
    'Songti SC', // 宋体-简
    'Songti TC', // 宋体-繁
    'Kaiti SC', // 楷体-简
    'Kaiti TC', // 楷体-繁
    'Heiti SC', // 黑体-简
    'Heiti TC', // 黑体-繁
    'Yuanti SC', // 圆体-简
    'Yuanti TC', // 圆体-繁
    'Xingkai SC', // 行楷-简
    'Xingkai TC', // 行楷-繁
    'Baoli SC', // 报隶-简
    'Weibei SC', // 魏碑-简
    'Weibei TC', // 魏碑-繁
    'Libian SC', // 隶变-简
    'Libian TC', // 隶变-繁
    'Wawati SC', // 娃娃体-简
    'Wawati TC', // 娃娃体-繁
    'Lantinghei SC', // 兰亭黑-简
    'Lantinghei TC', // 兰亭黑-繁
    'Hannotate SC', // 手札体-简
    'Hannotate TC', // 手札体-繁
    'HanziPen SC', // 翩翩体-简
    'HanziPen TC', // 翩翩体-繁
    'Yuppy SC', // 雅痞-简
    'Yuppy TC', // 雅痞-繁
    'Hiragino Sans', // 冬青黑体
    'Hiragino Sans GB', // 冬青黑体简体中文
    'Hiragino Mincho ProN', // 冬青明朝
    'Hiragino Kaku Gothic ProN', // 冬青角黑
    'Hiragino Maru Gothic ProN', // 冬青丸黑
    'Apple LiGothic', // 苹果俪中黑
    'Apple LiSung', // 苹果俪细宋
    'LiHei Pro', // 俪黑 Pro
    'LiSong Pro', // 俪宋 Pro
    'BiauKai', // 标楷体
    'PMingLiU', // 新细明体
    'MingLiU', // 细明体
    'Hei', // 黑体（旧）
    'Kai' // 楷体（旧）
  ]
}

// macOS 常见英文/数字字体
function getMacOSLatinFonts(): string[] {
  return [
    'Helvetica Neue',
    'Helvetica',
    'Arial',
    'Arial Narrow',
    'Arial Rounded MT Bold',
    'Avenir',
    'Avenir Next',
    'Futura',
    'Menlo',
    'Monaco',
    'Geneva',
    'Optima',
    'Didot',
    'Baskerville',
    'Cochin',
    'Copperplate',
    'Gill Sans',
    'Hoefler Text',
    'Lucida Grande',
    'Marker Felt',
    'Palatino',
    'Papyrus',
    'Savoye LET',
    'Snell Roundhand',
    'American Typewriter',
    'Andale Mono',
    'Courier',
    'Courier New',
    'Times',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Impact',
    'Comic Sans MS',
    'Chalkboard SE',
    'Chalkduster',
    'Noteworthy',
    'Bradley Hand',
    'Zapfino'
  ]
}

// 通过 canvas 测量文本宽度判断字体是否真实安装在系统中
// 分片执行避免一次性阻塞主线程(上千候选时单次全量测量可达秒级)
async function detectAvailableFonts(candidates: string[]): Promise<string[]> {
  if (typeof document === 'undefined') return []
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return []

  const baselines = ['monospace', 'sans-serif', 'serif'] as const
  const testText = 'mmmmmmmmmmlliWwQq@#印章测试三国统一隶书楷体0123456789'
  const fontSize = 72

  const baselineWidths = baselines.map(baseline => {
    context.font = `${fontSize}px ${baseline}`
    return context.measureText(testText).width
  })

  const available: string[] = []
  const CHUNK = 120
  for (let start = 0; start < candidates.length; start += CHUNK) {
    for (const fontName of candidates.slice(start, start + CHUNK)) {
      const family = fontName.replace(/"/g, '')
      // 大多数字体第一个基线就能区分,失败才继续测其余基线
      for (let i = 0; i < baselines.length; i++) {
        context.font = `${fontSize}px "${family}", ${baselines[i]}`
        if (Math.abs(context.measureText(testText).width - baselineWidths[i]) > 0.01) {
          available.push(fontName)
          break
        }
      }
    }
    if (start + CHUNK < candidates.length) {
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }
  return available
}

let systemFontsCache: string[] | null = null
let systemFontsInflight: Promise<string[]> | null = null

export async function getSystemFonts(): Promise<string[]> {
  if (systemFontsCache) return systemFontsCache
  if (systemFontsInflight) return systemFontsInflight

  systemFontsInflight = (async () => {
    const detected = new Set<string>()
    try {
      // 1. canvas 探测：所有浏览器可用，无需权限，覆盖 macOS 常见字体与国标字体
      const candidates = Array.from(new Set([
        ...getChineseFonts(),
        ...getMacOSChineseFonts(),
        ...getMacOSLatinFonts(),
        ...LOCAL_FONT_CANDIDATES
      ]))
      ;(await detectAvailableFonts(candidates)).forEach(font => detected.add(font))

      // 2. Local Font Access API（Chrome/Edge）：拿到完整系统字体家族列表
      // @ts-ignore
      if (typeof window !== 'undefined' && window.queryLocalFonts) {
        try {
          // @ts-ignore
          const localFonts = await window.queryLocalFonts()
          localFonts.forEach((font: any) => detected.add(String(font.family)))
        } catch {
          // 用户拒绝授权或环境不支持时，保留 canvas 探测结果
        }
      }
    } catch (error) {
      console.error('获取系统字体失败:', error)
    }

    // 保证印章推荐字体始终可选（内置打包 STLiti 等）
    getRecommendedStampFonts().forEach(font => detected.add(font))

    // 同一字体可能命中多个名称变体(中文名/拉丁别名/PS名),按显示名去重
    const byDisplay = new Map<string, string>()
    Array.from(detected)
      .filter(Boolean)
      .sort((a, b) => getFontDisplayName(a).localeCompare(getFontDisplayName(b), 'zh-Hans-CN'))
      .forEach(name => {
        const display = getFontDisplayName(name)
        // 优先保留与显示名一致的条目,其次是先遇到的别名
        if (!byDisplay.has(display) || name === display) {
          byDisplay.set(display, name)
        }
      })
    const result = Array.from(byDisplay.values())
    systemFontsCache = result
    systemFontsInflight = null
    return result
  })()

  return systemFontsInflight
}

// 清除缓存并重新枚举（用于用户授权 local-fonts 权限后刷新）
export async function refreshSystemFonts(): Promise<string[]> {
  systemFontsCache = null
  const fonts = await getSystemFonts()
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<string[]>('drawstamp:system-fonts-changed', { detail: fonts }))
  }
  return fonts
}
