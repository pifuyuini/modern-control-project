# Model-1019 教学包使用手册

配套教学包版本：1.0　更新日期：2026-11-05

[返回作业说明](../) · [下载完整教学包](../downloads/model1019_coursework_v1.zip) · [仅下载模型 MAT](../downloads/model1019.mat)

适用对象：使用本教学包开展信号生成、状态空间仿真和频谱分析的教师与学生。

## 1. 交付范围与固定约定

本教学包提供四项内容：连续时间状态空间模型、地面运动源、传感噪声谱及其生成器、Python 与 MATLAB 两套完整使用示例。全部运行资源随包提供，示例不需要访问原研究仓库或下载地面源数据。

模型统一称为 Model-1019，包含控制输入、基座扰动输入和六路测量输出，导出文件命名为 `model1019.mat`。外部输入、输出已统一为本手册规定的单位。模型保留通道间耦合；“六通道”不表示六个完全独立的单输入单输出对象。

**外部接口统一使用 SI 单位。** 模型和噪声生成器已经完成转动通道的尺度换算。基座转角直接使用 rad，输出角速度直接使用 rad/s，调用方无需再次进行长度缩放。

示例只连接地面源、模型和传感噪声，六路执行器命令均为零。包内不包含控制器、控制器参数或控制器设计示例。

## 2. 文件组成

```text
model1019_coursework/
  README.md
  PACKAGE_INFO.json
  data/
    model1019.mat
    activity_source.mat
    activity_config.json
    sensor_noise_psd.csv
  python/
    requirements.txt
    run_example.py
    sources.py
    simulation.py
  matlab/
    run_example.m
    activity_motion.m
    sensor_noise.m
    real_record.m
    FOHPlant.m
    WelchAccumulator.m
    plot_asds.m
```

| 文件或目录 | 用途 |
| --- | --- |
| `data/model1019.mat` | 连续时间 A、B、C、D，以及通道说明、固定长度和初始状态换算矩阵 |
| `data/activity_source.mat` | 两种语言共同读取的地面源参数与参考数据 |
| `data/activity_config.json` | 地面源配置的可读记录，供查阅；运行时以 `activity_source.mat` 为准 |
| `data/sensor_noise_psd.csv` | 教学用传感噪声谱表，字段为 `f,P_ns` |
| `python/` | Python 源生成、模型计算、Welch 和绘图代码 |
| `matlab/` | MATLAB 对应代码，独立运行，不调用 Python |
| `PACKAGE_INFO.json` | 交付版本、固定参数、数据来源和审阅状态 |

使用手册已单独部署在[课程网站](./)，不再随压缩包重复提供。

第一次运行后会出现 `outputs/` 目录。此目录是计算结果目录，不属于模型或源的输入资源。

## 3. 运行环境与资源要求

### 3.1 Python

使用 Python 3.10 或更高版本，并准备以下依赖：NumPy 1.24 或更高版本、SciPy 1.10 或更高版本、Matplotlib 3.7 或更高版本。依赖清单位于 `python/requirements.txt`。教师可以在课程统一环境中预先配置这些库；示例本身不会安装库、修改环境或下载文件。

运行入口通过自身位置寻找 `data/`，因此可以从任意工作目录调用。不要仅复制 `run_example.py`，应保留完整的包目录结构。

### 3.2 MATLAB

代码面向 MATLAB R2019a 或更新版本，使用 `readmatrix`、`RandStream`、`fft`、`ifft`、`filter`、`eig` 等基础函数。主示例不使用 `ss`、`lsim` 或 `pwelch`，无需为本示例另配控制或信号处理工具箱。

启动前将包中的 `matlab/` 加入 MATLAB 路径。源文件和 MAT 资源以 UTF-8 文件名和普通 MAT 格式分发。

### 3.3 内存与磁盘

默认采样数为 N = 10000 × 1000 = 10000000。一个 N×6 的 double 数组占约 480 MB；地面和传感噪声两个完整数组合计约 960 MB，另有 FFT、模型分块计算和 Welch 缓冲区。因此运行时应预留数 GB 可用内存。这里是数组尺寸估算，不是实测峰值或运行时长报告。

示例把完整源时程保存在内存中，模型输出按 100000 点分块处理。默认仅保存频谱、图和运行设置，不把大体积时程写入磁盘。退出程序后，内存中的时程释放。

## 4. 快速开始

### 4.1 运行 Python 示例

解压后，在包根目录执行：

```sh
python python/run_example.py
```

也可以使用绝对路径，从其他工作目录调用：

```sh
python /path/to/model1019_coursework/python/run_example.py
```

默认配置为 10 kHz、1000 s、给定地面扰动场景、地面种子 1024、传感噪声种子 20260114。程序在终端输出源生成和模型处理进度，最终将结果写入 `outputs/python/`。

指定新的随机实现和输出目录：

```sh
python python/run_example.py --ground-seed 1042 --noise-seed 20260115 --output outputs/python_case2
```

### 4.2 运行 MATLAB 示例

将 MATLAB 当前文件夹切换到包根目录，然后执行：

```matlab
addpath(fullfile(pwd,'matlab'));
run_example;
```

从其他位置调用时，明确指定包目录：

```matlab
package_dir = '/path/to/model1019_coursework';
addpath(fullfile(package_dir,'matlab'));
run_example(1000,1024,20260114,fullfile(package_dir,'outputs','matlab'));
```

默认结果写入 `outputs/matlab/`。Python 和 MATLAB 使用不同目录，避免两套示例覆盖彼此结果。同一语言反复使用相同输出目录时，会覆盖同名结果文件。

### 4.3 仅缩短记录进行接口学习

两版入口允许改变记录时长，最短为 100 s，因为固定的 Welch 分段长度对应 100 s。正式作业比较建议保持默认 1000 s。

```sh
python python/run_example.py --duration 200 --output outputs/python_200s
```

```matlab
run_example(200,1024,20260114,fullfile(package_dir,'outputs','matlab_200s'));
```

缩短时长会改变源的频率网格、可覆盖的低频、事件是否出现和 Welch 平均次数。200 s 记录的 FFT 网格间距为 0.005 Hz，不能生成 0.001 Hz 独立频点，也可能无法覆盖完整的时变扰动。因此短记录结果不能当作默认 1000 s 情景的等价结果。

## 5. 模型接口

### 5.1 基本方程与矩阵尺寸

导出的模型是连续时间系统：

```text
dx/dt = A x + B u
y_clean = C x + D u
u = [u_actuator; b_si]
y_measured = y_clean + n_si
```

| 变量 | 尺寸 | 说明 |
| --- | --- | --- |
| `A` | 20×20 | 连续时间状态矩阵 |
| `B` | 20×12 | 前六列为执行器命令，后六列为基座运动 |
| `C` | 6×20 | 六路无附加噪声的测量输出 |
| `D` | 6×12 | 直接传递矩阵；使用时应完整保留 |
| `x` | 20×1 | 导出实现的内部状态 |
| `u` | 12×1 | 单时刻完整输入列向量 |
| `y_clean`、`y_measured` | 6×1 | 单时刻测量速度列向量 |

文件中的 `sample_time=0` 表示连续时间。示例采用 10000 Hz 的时间网格对该连续系统进行计算，不能直接把连续 A、B 当成离散递推矩阵使用。

### 5.2 十二路输入顺序

| MATLAB 列号 | Python 列下标 | 名称 | 物理量与单位 |
| --- | --- | --- | --- |
| 1–6 | 0–5 | `u_x,u_y,u_z,u_LRx,u_LRy,u_LRz` | 模型的六路几何虚拟执行器命令；示例全部置零 |
| 7 | 6 | `base_x` | 基座 x 位移，m |
| 8 | 7 | `base_y` | 基座 y 位移，m |
| 9 | 8 | `base_z` | 基座 z 位移，m |
| 10 | 9 | `base_theta_x` | 基座绕 x 轴转角，rad |
| 11 | 10 | `base_theta_y` | 基座绕 y 轴转角，rad |
| 12 | 11 | `base_theta_z` | 基座绕 z 轴转角，rad |

基座通道接收的是**位移与小转角**，不是速度、加速度或执行器命令。地面生成器的输出可直接连接这六列，不需要额外积分、数值微分或长度缩放。

前六列命令的单位沿用原模型的虚拟命令约定，不能解释为 N 或 N·m，也不能把地面位移填入这些列。命令名称中的 `L` 保留源模型的通道命名，不构成要求调用方再进行单位换算。

### 5.3 六路输出顺序

| MATLAB 列号 | Python 列下标 | 输出名称 | 单位 |
| --- | --- | --- | --- |
| 1 | 0 | `vx_apparent` | m/s |
| 2 | 1 | `vy_apparent` | m/s |
| 3 | 2 | `vz` | m/s |
| 4 | 3 | `omega_x` | rad/s |
| 5 | 4 | `omega_y` | rad/s |
| 6 | 5 | `omega_z` | rad/s |

输出保留模型已有的测量链，包括倾角相关项和低通状态。尤其前两路是表观速度。按本手册绘制的输出 ASD 是测量速度换算后的位移／转角等效 ASD，不应直接称为未经过测量链的真实机械位移 ASD。

### 5.4 MAT 文件中的辅助字段

| 字段 | 尺寸／值 | 用法 |
| --- | --- | --- |
| `B_actuator`、`B_ground` | 各 20×6 | 分别对应 B 的前六列和后六列 |
| `D_actuator`、`D_ground` | 各 6×6 | 对应 D 的输入分组 |
| `state_recovery_J_si` | 20×6 | 初始化辅助字段，默认由包内求解器处理 |
| `input_names`、`input_units` | 各 12 项 | 输入的名称与单位 |
| `output_names`、`output_units` | 各 6 项 | 输出的名称与单位 |
| `state_names`、`state_units` | 各 20 项 | 内部状态说明 |

MAT 文件中的矩阵已与外部 SI 接口一致。直接使用提供的 A、B、C、D 及配套源生成器，不需要额外转换转动输入或输出。

### 5.5 初始状态与分块计算

模型中的辅助状态与机械运动状态采用不同的定义。默认无控制示例的初始条件已由包内求解器设置。两版 `FOHPlant` 都会结合基座初始输入完成初始化，因此应按示例传入首个完整输入样本。

分块处理时应持续使用同一个 `FOHPlant` 对象，不能每个数据块重新创建对象，否则会反复重置状态。若自行实现模型求解，应保持与配套示例一致的初始化约定，并在报告中说明。

## 6. 地面扰动源

地面源采用教学包给定的合成场景。数值配置封装在 `activity_source.mat`，Python 与 MATLAB 实现读取同一份资源文件。

| 项目 | 约定 |
| --- | --- |
| 输出变量 | `b_si` |
| 数组形状 | N×6；每行一个时刻，每列一个自由度 |
| 通道顺序 | x、y、z、theta_x、theta_y、theta_z |
| 单位 | 前三列 m，后三列 rad |
| 目标通带 | 0.001–1000 Hz |
| 默认采样率／时长 | 10000 Hz／1000 s |
| 默认随机种子 | 1024 |
| 默认时刻 | t[k]=k/fs，k=0,…,N−1；最后时刻为 999.9999 s |

0.001–1000 Hz 为本版本的目标通带。六路地面运动具有相关性，应使用配套生成器保留既定信号关系，不能仅按六条独立自谱替代整个地面源。

生成器使用谱方法形成有限记录；在给定时长 T 下，频率网格间距为 1/T。默认 1000 s 可包含 0.001 Hz 网格点，但该最低频率只有一个记录周期。源的设定频带不等同于 Welch 图的可分辨频带。

单独调用：

```python
from sources import activity_motion
b_si = activity_motion(fs=10000, duration=1000, seed=1024)
```

```matlab
b_si = activity_motion(10000,1000,1024);
```

上述 Python 导入要求 `python/` 位于模块搜索路径中，例如在 `python/` 中编写自己的脚本，或从该目录启动交互环境。MATLAB 调用前需要先将 `matlab/` 加入路径。

## 7. 传感噪声

### 7.1 谱文件接口

`sensor_noise_psd.csv` 保留给定文件的两列内容，首行为列名：

```text
f,P_ns
```

| 字段 | 含义 | 单位 |
| --- | --- | --- |
| `f` | 频率 | Hz |
| `P_ns` | 单边、按 Hz 计的速度等效功率谱密度 | (m/s)²/Hz |

表中数值是 PSD，不是 ASD，也不是 dB。程序在 0.001–1000 Hz 内对频率与 PSD 的对数作线性插值，不在表外延拓；这一频带以外的传感噪声谱置零。

### 7.2 六路生成与单位

程序依据给定谱表生成六路独立的随机噪声，并在生成器内部完成单位处理。前三路输出单位为 m/s，后三路输出单位为 rad/s。返回结果可直接与同顺序的模型测量输出相加。

```python
from sources import sensor_noise
n_si = sensor_noise(fs=10000, duration=1000, seed=20260114)
```

```matlab
n_si = sensor_noise(10000,1000,20260114);
```

`n_si` 的形状为 N×6，通道顺序与模型输出一致，可直接与 `y_clean` 相加。生成器的返回值已经完成角速度换算，不需要再次进行长度缩放。六路独立指随机生成过程独立；有限记录的样本相关系数不要求严格等于零。

### 7.3 注入位置

噪声在模型已有测量链之后加入：`y_measured = y_clean + n_si`。不能把这份速度等效噪声接到模型的基座位移输入，也不能在相加后再次通过模型 C、D 或其低通状态。

## 8. 示例如何组织信号

两版入口采用相同的步骤：生成地面位移和传感噪声；将六路零执行器命令与地面位移拼成十二路输入；初始化并逐块推进模型；在输出后加噪声；累计四组信号的 Welch PSD；换算并绘制 ASD。

1. 生成基座位移和转角 `b_si`。
2. 将六路零控制命令与 `b_si` 合并为十二路输入 `u`。
3. 推进状态空间模型，得到 `y_clean`。
4. 在测量输出端加入 `n_si`，得到 `y_measured`。
5. 累计各组信号的 PSD，换算并绘制 ASD。

### 8.1 Python 中的连接片段

```python
from pathlib import Path
import numpy as np
from scipy.io import loadmat
from simulation import FOHPlant

package_dir = Path('/path/to/model1019_coursework')
M = loadmat(package_dir/'data'/'model1019.mat', simplify_cells=True)
# b_si 和 n_si 均为已生成的 N×6 数组。
plant = FOHPlant(M,10000,np.r_[np.zeros(6),b_si[0]])
for start in range(0,len(b_si),100000):
    base = b_si[start:start+100000]
    u = np.column_stack((np.zeros_like(base),base))
    y_clean = plant.process(u)
    y_measured = y_clean+n_si[start:start+len(base)]
    # 在这里使用当前块的结果；完整示例将其送入 WelchAccumulator。
```

### 8.2 MATLAB 中的连接片段

```matlab
M = load(fullfile(package_dir,'data','model1019.mat'));
plant = FOHPlant(M,10000,[zeros(1,6),b_si(1,:)]);
for first = 1:100000:size(b_si,1)
    last = min(first+99999,size(b_si,1));
    base = b_si(first:last,:);
    u = [zeros(size(base)),base];
    y_clean = plant.process(u);
    y_measured = y_clean+n_si(first:last,:);
    % 在这里使用当前块的结果；完整示例将其送入 WelchAccumulator。
end
```

模型处理器按样点间线性插值的一阶保持（FOH）约定处理输入，该约定已包含在配套示例中。示例按给定初始化方式启动，默认保留全部 1000 s，包含启动过程，不自动删去前段。

## 9. PSD 与 ASD 的统一规范

### 9.1 Welch 参数

| 参数 | 固定值 |
| --- | --- |
| `fs` | 10000 Hz |
| `nperseg`／分段长度 | 1000000 点，即 100 s |
| 窗 | 周期 Hann；不是两端对称 Hann |
| 重叠长度 | 500000 点，即 50% |
| `nfft` | 1000000 |
| 去趋势 | 每一段先减去该段均值；constant detrend |
| 归一化 | density，PSD 按 Hz 计 |
| 平均方式 | mean，对分段功率谱作算术平均 |
| 频谱类型 | 实信号单边谱 |
| 频率间距 | 0.01 Hz |
| 默认完整段数 | 19 段 |

窗口定义为 `w[n]=0.5−0.5 cos(2πn/M)`，其中 M=1000000，n=0,…,M−1。逐段去均值后加窗，FFT 幅值平方除以 `fs × sum(w²)`。转换为单边谱时，除 DC 和 Nyquist 点外其余频点乘以 2。最后对各段 PSD 求算术平均。

只去除整条记录的均值不等价于逐段 constant detrend；对每段 ASD 求平均也不等价于先平均 PSD 再开平方。

### 9.2 Python 标准函数写法

包内为降低内存使用而实现了分块 Welch 累加器。其采用的定义对应以下 SciPy 调用，其中 `x` 为 N×通道数的实数组：

```python
from scipy import signal
window = signal.windows.hann(1000000,sym=False)
f,P = signal.welch(
    x,fs=10000,window=window,nperseg=1000000,
    noverlap=500000,nfft=1000000,detrend='constant',
    return_onesided=True,scaling='density',average='mean',axis=0)
```

此段说明算法约定，不表示已经执行数值比较。

### 9.3 MATLAB 的对应实现

包内 `WelchAccumulator` 使用基础 `fft` 明确实现相同定义，不依赖 `pwelch` 的默认窗口、去均值或归一化约定。使用方法为：

```matlab
W = WelchAccumulator(24,10000,1000000);
% 每个 block 都应按相同的列顺序传入，并连续使用同一个 W。
W.push([base,y_clean,noise,y_measured]);
[f,P] = W.result();
```

累加器保留上一完整段的后 500000 点。数据块边界不会重新定义 Welch 分段位置。记录末尾不足一个完整段的余量不单独计算；默认 1000 s 恰好得到 19 段。

### 9.4 从 PSD 换算 ASD

四组信号的处理规则如下：

| 信号组 | 输入 PSD 对应的量 | 位移／转角等效 ASD |
| --- | --- | --- |
| ground | 位移／转角 | `sqrt(P_ground)` |
| clean | 测量速度／角速度 | `sqrt(P_clean)/(2*pi*f+1e-30)` |
| noise | 速度／角速度噪声 | `sqrt(P_noise)/(2*pi*f+1e-30)` |
| measured | 含噪测量速度／角速度 | `sqrt(P_measured)/(2*pi*f+1e-30)` |

地面源已经是位移／转角，不应再除以 2πf。其余三组必须使用 `2*pi*f`，不能仅除以 f。前三列最终单位为 m/√Hz，后三列为 rad/√Hz。

`1e-30` 仅用于避免零频数值除零；零频的速度积分结果没有用于比较的意义。绘图必须排除 f=0，不能把该点放入对数坐标。

含噪输出应先在时域相加，再计算该记录的 PSD。有限记录中不应直接把 `ASD_clean+ASD_noise` 当作含噪输出 ASD；即使在独立随机过程的集合意义下，可相加的也是 PSD，而不是 ASD。

### 9.5 六图格式

以下先说明无控制示例的四组信号图。作业中的控制性能对比，应在相同条件下分别计算 Control off 与 Control on 的含噪测量输出，并在每个通道的同一坐标轴中叠加两种工况，频率范围、单位和留白规则相同。

使用 2 行×3 列子图，按 x、y、z、theta_x、theta_y、theta_z 排列。每幅图显示 ground、clean、noise、measured 四条曲线。

- 横轴为对数频率，范围固定 0.01–100 Hz；零频排除。
- 纵轴为对数 ASD；前三幅用 m/√Hz，后三幅用 rad/√Hz。
- 每幅图按其四条曲线在显示频带内的有限正值共同确定纵轴范围。
- 设 a=log10(最小值)、b=log10(最大值)，上下限取 `10^(a−0.08(b−a))`、`10^(b+0.08(b−a))`，即在对数空间各留约 8% 余量。
- 图题注明情景、无控制状态、采样率和时长，图中或图注记录 Welch 参数。

## 10. 输出文件说明

### 10.1 spectra.mat

两版程序采用相同字段和列顺序，仅保存 0–100 Hz 的谱用于作业绘图。源仍按完整设定频带生成，结果文件截取频率不代表时域信号经过 100 Hz 低通。

| 字段 | 形状／类型 | 含义 |
| --- | --- | --- |
| `frequency_hz` | 10001×1，默认配置 | 0、0.01、…、100 Hz |
| `psd` | 10001×24 | 四组各六路的单边 PSD |
| `asd` | 10001×24 | 按第 9 节换算后的 ASD |
| `group_order` | 4 项 | ground、clean、noise、measured |
| `channel_order` | 6 项 | x、y、z、theta_x、theta_y、theta_z |
| `welch_segment_count` | 标量 | 实际完整分段数，默认应为 19 |

| MATLAB 列 | Python 切片 | 内容 |
| --- | --- | --- |
| 1:6 | `[:,0:6]` | ground |
| 7:12 | `[:,6:12]` | clean |
| 13:18 | `[:,12:18]` | noise |
| 19:24 | `[:,18:24]` | measured |

`psd` 的不同组有不同单位：ground 为 m²/Hz 或 rad²/Hz；另外三组为 (m/s)²/Hz 或 (rad/s)²/Hz。`asd` 的四组统一为 m/√Hz 或 rad/√Hz。读取或另行作图时应使用字段分组，不要把整个 PSD 矩阵当成同一物理量。

### 10.2 asd_comparison.png

四组信号的六幅 ASD 对比图，按第 9 节规范生成。该图是执行示例后的输出，本教学包没有附带预先计算的示例曲线。

### 10.3 run_info.json

记录采样率、时长、样本数、固定参考长度、两个随机种子、Welch 参数、实际分段数、初始状态约定、执行器置零状态和运行耗时，便于在作业报告中明确计算条件。

## 11. 可调整项与结果可比性

入口允许调整记录时长、地面随机种子、传感噪声随机种子和输出目录。正式比较时应统一采样率、时长、种子、初始状态和频谱处理参数。

接口尺度、基座输入类型、输出单位以及默认 Welch 规范均为本教学包的固定约定。`activity_config.json` 是可读记录，单独修改它不会改变运行中读取的 MAT 参数。

Python 使用 NumPy 随机数生成器，MATLAB 使用本地 `RandStream`。两种语言的随机实现不同，**相同数值的种子不表示跨语言逐样本一致**。它们实现相同的源参数和谱定义；跨语言比较随机谱时应考虑有限记录差异。若课程另要求逐点对照，应由教师另行统一分发同一份输入时程，不能把两种独立生成的记录作为逐点误差依据。

示例默认保留启动过程。如果自行截去前段，应同时说明截取区间、剩余记录长度和 Welch 段数，并对参与同一比较的信号采用一致处理；不要在报告中仍标称使用全部 1000 s。

## 12. 常见使用问题

| 现象 | 应检查的事项 |
| --- | --- |
| Python 提示无法导入 NumPy、SciPy 或 Matplotlib | 当前解释器是否为已配置依赖的课程环境；参考 `requirements.txt` |
| Python 提示无法导入 `sources` 或 `simulation` | 使用给定入口，或将包中的 `python/` 加入模块路径；保留同目录文件 |
| MATLAB 找不到 `run_example` 或 `FOHPlant` | 是否已对包内 `matlab/` 执行 `addpath` |
| 找不到 MAT 或 CSV | 是否完整解压并保持 `data/` 与 `python/`、`matlab/` 同级 |
| 运行占用较多内存 | 完整时程会在内存生成；关闭无关大数组，或使用较短记录学习接口，并注明其频率范围改变 |
| 转动通道量级不符 | 输入应为 rad、输出为 rad/s；不得重复进行长度缩放，不得把角度数值当作弧度 |
| 源和输出曲线单位不一致 | 地面取 `sqrt(PSD)`；速度类输出取 `sqrt(PSD)/(2*pi*f+1e-30)` |
| 图上出现异常零频点 | 对数图必须筛选正频率，并限定 0.01–100 Hz |
| 每块输出都有重新启动的形态 | 是否在循环内重新创建了 `FOHPlant`；模型对象应跨块复用 |
| 两种语言相同种子得到不同曲线 | 随机数实现不同；同种子只用于各自环境内复现，不保证跨语言逐点一致 |

## 13. 使用边界与交付状态

本包作为课程数值计算资源提供，模型采用给定的名义实现，地面扰动为合成场景。源的 0.001–1000 Hz 通带不表示平台模型已在相同全频带获得实验辨识。作业应以本手册给定的接口和计算约定为准，无需另行推导模型或地面源的物理参数。

教学包未附预生成的仿真结果。源文件和接口已做静态审阅，尚未据此确认完整仿真结果或跨语言数值一致性，实际运行结果应在课程环境中检查。

模型、地面源和教学用传感谱随包提供。运行资源均位于 `data/`，使用时保持文件结构与给定接口一致。

## 14. 函数说明参考

以下官方文档供查阅函数接口；本教学包实际采用的数组顺序、单位和 Welch 规范以本手册为准。

- [SciPy signal.welch](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.welch.html)
- [MATLAB filter](https://www.mathworks.com/help/matlab/ref/filter.html)
- [MATLAB ifft](https://www.mathworks.com/help/matlab/ref/ifft.html)
- [MATLAB readmatrix](https://www.mathworks.com/help/matlab/ref/readmatrix.html)
- [MATLAB pwelch](https://www.mathworks.com/help/signal/ref/pwelch.html)：了解 Welch 定义；主示例采用包内明确去均值的 FFT 实现。
