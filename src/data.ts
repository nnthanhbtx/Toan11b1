export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  solution: string;
  tikz?: string;
}

export const questionSets: Question[][] = [
  // SET 1
  [
    {
      id: 1,
      question: "Đổi góc có số đo $45^\\circ$ sang radian.",
      options: ["$\\frac{\\pi}{4}$", "$\\frac{\\pi}{3}$", "$\\frac{\\pi}{2}$", "$\\frac{\\pi}{6}$"],
      correctAnswerIndex: 0,
      solution: "Ta có $\\alpha(\\text{rad}) = 45^\\circ \\cdot \\frac{\\pi}{180^\\circ} = \\frac{\\pi}{4}$."
    },
    {
      id: 2,
      question: "Cung tròn có số đo $\\frac{\\pi}{3}$ rad trên đường tròn bán kính $R=6$ cm có độ dài là bao nhiêu?",
      options: ["$3\\pi$ cm", "$2\\pi$ cm", "$6\\pi$ cm", "$\\pi$ cm"],
      correctAnswerIndex: 1,
      solution: "Độ dài cung tròn $l = R\\alpha = 6 \\cdot \\frac{\\pi}{3} = 2\\pi$ (cm)."
    },
    {
      id: 3,
      question: "Điểm $M(x;y)$ trên đường tròn lượng giác biểu diễn góc lượng giác $\\alpha$. Hoành độ $x$ của điểm $M$ là gì?",
      options: ["$\\sin\\alpha$", "$\\cos\\alpha$", "$\\tan\\alpha$", "$\\cot\\alpha$"],
      correctAnswerIndex: 1,
      solution: "Theo định nghĩa trên đường tròn lượng giác, hoành độ điểm $M$ biểu diễn góc $\\alpha$ được gọi là $\\cos\\alpha$."
    },
    {
      id: 4,
      question: "Trong mặt phẳng tọa độ $Oxy$, góc phần tư thứ II có đặc điểm gì về dấu của các giá trị lượng giác?",
      options: ["$\\sin\\alpha > 0, \\cos\\alpha > 0$", "$\\sin\\alpha < 0, \\cos\\alpha > 0$", "$\\sin\\alpha > 0, \\cos\\alpha < 0$", "$\\sin\\alpha < 0, \\cos\\alpha < 0$"],
      correctAnswerIndex: 2,
      solution: "Ở góc phần tư thứ II, tung độ dương ($\\sin\\alpha > 0$) và hoành độ âm ($\\cos\\alpha < 0$).",
      tikz: `
\\begin{tikzpicture}[scale=1.5]
  \\draw[->] (-1.2,0) -- (1.2,0) node[right] {$x$};
  \\draw[->] (0,-1.2) -- (0,1.2) node[above] {$y$};
  \\draw (0,0) circle (1);
  \\fill[red, opacity=0.2] (-1,0) rectangle (0,1);
  \\node[red] at (-0.5, 0.5) {II};
\\end{tikzpicture}
      `
    },
    {
      id: 5,
      question: "Giá trị của $\\sin(150^\\circ)$ là bao nhiêu?",
      options: ["$\\frac{1}{2}$", "$-\\frac{1}{2}$", "$\\frac{\\sqrt{3}}{2}$", "$-\\frac{\\sqrt{3}}{2}$"],
      correctAnswerIndex: 0,
      solution: "$\\sin(150^\\circ) = \\sin(180^\\circ - 30^\\circ) = \\sin(30^\\circ) = \\frac{1}{2}$."
    },
    {
      id: 6,
      question: "Cho $\\cos\\alpha = \\frac{1}{3}$ với $0 < \\alpha < \\frac{\\pi}{2}$. Tính $\\sin\\alpha$.",
      options: ["$\\frac{8}{9}$", "$\\frac{2\\sqrt{2}}{3}$", "$-\\frac{2\\sqrt{2}}{3}$", "$\\frac{4}{9}$"],
      correctAnswerIndex: 1,
      solution: "Ta có $\\sin^2\\alpha = 1 - \\cos^2\\alpha = 1 - \\frac{1}{9} = \\frac{8}{9}$. Vì $0 < \\alpha < \\frac{\\pi}{2}$ nên $\\sin\\alpha > 0$. Do đó $\\sin\\alpha = \\frac{2\\sqrt{2}}{3}$."
    },
    {
      id: 7,
      question: "Khẳng định nào sau đây là SAI?",
      options: ["$\\sin^2\\alpha + \\cos^2\\alpha = 1$", "$1 + \\tan^2\\alpha = \\frac{1}{\\cos^2\\alpha}$", "$\\tan\\alpha \\cdot \\cot\\alpha = 1$", "$\\sin^2\\alpha + \\cos^2\\alpha = 2$"],
      correctAnswerIndex: 3,
      solution: "Hệ thức lượng giác cơ bản là $\\sin^2\\alpha + \\cos^2\\alpha = 1$. Do đó $\\sin^2\\alpha + \\cos^2\\alpha = 2$ là sai."
    },
    {
      id: 8,
      question: "Cho hai góc đối nhau $\\alpha$ và $-\\alpha$. Mệnh đề nào sau đây đúng?",
      options: ["$\\cos(-\\alpha) = -\\cos\\alpha$", "$\\sin(-\\alpha) = \\sin\\alpha$", "$\\cos(-\\alpha) = \\cos\\alpha$", "$\\tan(-\\alpha) = \\tan\\alpha$"],
      correctAnswerIndex: 2,
      solution: "Theo tính chất \"cos đối\", ta có $\\cos(-\\alpha) = \\cos\\alpha$. Các hàm số khác đổi dấu."
    },
    {
      id: 9,
      question: "Cho hai góc bù nhau $\\alpha$ và $\\pi - \\alpha$. Mệnh đề nào sau đây đúng?",
      options: ["$\\sin(\\pi - \\alpha) = \\sin\\alpha$", "$\\cos(\\pi - \\alpha) = \\cos\\alpha$", "$\\sin(\\pi - \\alpha) = -\\sin\\alpha$", "$\\cot(\\pi - \\alpha) = \\cot\\alpha$"],
      correctAnswerIndex: 0,
      solution: "Theo tính chất \"sin bù\", ta có $\\sin(\\pi - \\alpha) = \\sin\\alpha$."
    },
    {
      id: 10,
      question: "Trên đường tròn lượng giác, điểm biểu diễn góc $\\frac{15\\pi}{4}$ trùng với điểm biểu diễn góc nào sau đây trên đoạn $[0; 2\\pi]$?",
      options: ["$\\frac{3\\pi}{4}$", "$\\frac{7\\pi}{4}$", "$\\frac{5\\pi}{4}$", "$\\frac{\\pi}{4}$"],
      correctAnswerIndex: 1,
      solution: "Ta có $\\frac{15\\pi}{4} = 2\\pi + \\frac{7\\pi}{4}$. Do sai khác $2\\pi$, điểm biểu diễn trùng với góc $\\frac{7\\pi}{4}$."
    },
    {
      id: 11,
      question: "Một bánh xe quay đều 2 vòng trong 1 giây. Tính góc quay được (theo radian) của bánh xe trong 3 giây.",
      options: ["$6\\pi$", "$12\\pi$", "$8\\pi$", "$4\\pi$"],
      correctAnswerIndex: 1,
      solution: "Mỗi giây quay 2 vòng, tức là $2 \\cdot 2\\pi = 4\\pi$ radian. Trong 3 giây góc quay là $3 \\cdot 4\\pi = 12\\pi$."
    },
    {
      id: 12,
      question: "Cho $\\tan\\alpha = 3$. Tính giá trị biểu thức $A = \\frac{\\sin\\alpha - \\cos\\alpha}{\\sin\\alpha + \\cos\\alpha}$.",
      options: ["$\\frac{1}{2}$", "$2$", "$-\\frac{1}{2}$", "$\\frac{1}{4}$"],
      correctAnswerIndex: 0,
      solution: "Chia cả tử và mẫu cho $\\cos\\alpha \\neq 0$, ta được $A = \\frac{\\tan\\alpha - 1}{\\tan\\alpha + 1} = \\frac{3 - 1}{3 + 1} = \\frac{2}{4} = \\frac{1}{2}$."
    },
    {
      id: 13,
      question: "Tính giá trị của biểu thức $A = \\cos^2(10^\\circ) + \\cos^2(80^\\circ)$.",
      options: ["$0$", "$0.5$", "$1$", "$2$"],
      correctAnswerIndex: 2,
      solution: "Vì $10^\\circ$ và $80^\\circ$ là hai góc phụ nhau nên $\\cos(80^\\circ) = \\sin(10^\\circ)$. Do đó $A = \\cos^2(10^\\circ) + \\sin^2(10^\\circ) = 1$."
    },
    {
      id: 14,
      question: "Rút gọn biểu thức $B = \\cos\\left(\\frac{\\pi}{2} - x\\right) - \\sin(\\pi - x)$.",
      options: ["$0$", "$1$", "$2\\sin x$", "$-2\\sin x$"],
      correctAnswerIndex: 0,
      solution: "Ta có $\\cos\\left(\\frac{\\pi}{2} - x\\right) = \\sin x$ (góc phụ) và $\\sin(\\pi - x) = \\sin x$ (góc bù). Vậy $B = \\sin x - \\sin x = 0$."
    },
    {
      id: 15,
      question: "Một bánh xe quay được 2 vòng trong 1 giây. Tính góc quay được (theo đơn vị radian) của bánh xe trong $0.25$ giây, lấy kết quả chia cho $\\pi$.",
      options: ["$0.5$", "$1$", "$1.5$", "$2$"],
      correctAnswerIndex: 1,
      solution: "Trong 1 giây quay được 2 vòng $\\rightarrow$ góc quay là $4\\pi$. Trong 0.25 giây góc quay là $0.25 \\cdot 4\\pi = \\pi$. Lấy kết quả chia cho $\\pi$ được $1$."
    }
  ],
  // SET 2
  [
    {
      id: 1,
      question: "Góc có số đo $\\frac{5\\pi}{6}$ radian đổi sang độ là bao nhiêu?",
      options: ["$120^\\circ$", "$150^\\circ$", "$135^\\circ$", "$180^\\circ$"],
      correctAnswerIndex: 1,
      solution: "Ta có $a^\\circ = \\frac{5\\pi}{6} \\cdot \\frac{180^\\circ}{\\pi} = 150^\\circ$.",
      tikz: `
\\begin{tikzpicture}[scale=1.5]
  \\draw[->] (-1.2,0) -- (1.2,0) node[right] {$x$};
  \\draw[->] (0,-1.2) -- (0,1.2) node[above] {$y$};
  \\draw (0,0) circle (1);
  \\draw[thick, blue, ->] (0,0) -- (-0.866, 0.5) node[above left] {$\\frac{5\\pi}{6}$};
  \\draw[->, red, thick] (0.4,0) arc (0:150:0.4);
\\end{tikzpicture}
      `
    },
    {
      id: 2,
      question: "Trên đường tròn bán kính $R=10$, độ dài cung tròn có số đo $120^\\circ$ là bao nhiêu?",
      options: ["$\\frac{10\\pi}{3}$", "$\\frac{20\\pi}{3}$", "$10\\pi$", "$\\frac{5\\pi}{3}$"],
      correctAnswerIndex: 1,
      solution: "$120^\\circ = \\frac{2\\pi}{3}$ rad. Độ dài cung $l = R\\alpha = 10 \\cdot \\frac{2\\pi}{3} = \\frac{20\\pi}{3}$."
    },
    {
      id: 3,
      question: "Trục tung trên đường tròn lượng giác được gọi là trục gì?",
      options: ["Trục côsin", "Trục tang", "Trục sin", "Trục côtang"],
      correctAnswerIndex: 2,
      solution: "Tung độ của điểm biểu diễn là giá trị sin, do đó trục tung được gọi là trục sin."
    },
    {
      id: 4,
      question: "Góc $\\alpha$ thuộc khoảng $(\\pi; \\frac{3\\pi}{2})$. Dấu của $\\tan\\alpha$ là?",
      options: ["$\\tan\\alpha > 0$", "$\\tan\\alpha < 0$", "$\\tan\\alpha = 0$", "$\\tan\\alpha \\le 0$"],
      correctAnswerIndex: 0,
      solution: "Ở góc phần tư thứ III, $\\sin\\alpha < 0$ và $\\cos\\alpha < 0$ nên $\\tan\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha} > 0$."
    },
    {
      id: 5,
      question: "Giá trị của $\\cos\\frac{2\\pi}{3}$ là?",
      options: ["$\\frac{1}{2}$", "$-\\frac{1}{2}$", "$\\frac{\\sqrt{3}}{2}$", "$-\\frac{\\sqrt{3}}{2}$"],
      correctAnswerIndex: 1,
      solution: "$\\cos\\frac{2\\pi}{3} = -\\frac{1}{2}$."
    },
    {
      id: 6,
      question: "Cho $\\sin\\alpha = -\\frac{1}{2}$ với $\\pi < \\alpha < \\frac{3\\pi}{2}$. Tính $\\cos\\alpha$.",
      options: ["$\\frac{\\sqrt{3}}{2}$", "$-\\frac{\\sqrt{3}}{2}$", "$\\frac{1}{4}$", "$\\frac{3}{4}$"],
      correctAnswerIndex: 1,
      solution: "$\\cos^2\\alpha = 1 - \\sin^2\\alpha = \\frac{3}{4}$. Vì $\\alpha$ thuộc góc phần tư thứ III nên $\\cos\\alpha < 0$, suy ra $\\cos\\alpha = -\\frac{\\sqrt{3}}{2}$."
    },
    {
      id: 7,
      question: "Rút gọn biểu thức $1 + \\cot^2\\alpha$ (khi biểu thức xác định).",
      options: ["$\\frac{1}{\\cos^2\\alpha}$", "$\\frac{1}{\\sin^2\\alpha}$", "$\\tan^2\\alpha$", "$\\sin^2\\alpha$"],
      correctAnswerIndex: 1,
      solution: "$1 + \\cot^2\\alpha = 1 + \\frac{\\cos^2\\alpha}{\\sin^2\\alpha} = \\frac{\\sin^2\\alpha + \\cos^2\\alpha}{\\sin^2\\alpha} = \\frac{1}{\\sin^2\\alpha}$."
    },
    {
      id: 8,
      question: "Cho góc lượng giác $\\alpha$. Mệnh đề nào sau đây ĐÚNG?",
      options: ["$\\sin(-\\alpha) = \\sin\\alpha$", "$\\sin(-\\alpha) = -\\sin\\alpha$", "$\\cos(-\\alpha) = -\\cos\\alpha$", "$\\tan(-\\alpha) = \\tan\\alpha$"],
      correctAnswerIndex: 1,
      solution: "Theo tính chất \"cos đối\", chỉ có cos giữ nguyên dấu, các hàm khác đổi dấu. Nên $\\sin(-\\alpha) = -\\sin\\alpha$."
    },
    {
      id: 9,
      question: "Hai góc phụ nhau có tính chất nào sau đây?",
      options: ["$\\sin\\left(\\frac{\\pi}{2} - \\alpha\\right) = \\cos\\alpha$", "$\\cos\\left(\\frac{\\pi}{2} - \\alpha\\right) = -\\sin\\alpha$", "$\\sin\\left(\\frac{\\pi}{2} - \\alpha\\right) = -\\cos\\alpha$", "$\\tan\\left(\\frac{\\pi}{2} - \\alpha\\right) = -\\cot\\alpha$"],
      correctAnswerIndex: 0,
      solution: "\"Phụ chéo\" tức là sin góc này bằng cos góc kia, và ngược lại. Do đó $\\sin\\left(\\frac{\\pi}{2} - \\alpha\\right) = \\cos\\alpha$."
    },
    {
      id: 10,
      question: "Góc $-1000^\\circ$ có điểm biểu diễn trùng với góc nào sau đây trên đoạn $[0^\\circ; 360^\\circ]$?",
      options: ["$80^\\circ$", "$100^\\circ$", "$260^\\circ$", "$280^\\circ$"],
      correctAnswerIndex: 0,
      solution: "$-1000^\\circ = 80^\\circ - 3 \\cdot 360^\\circ$. Nên nó trùng với góc $80^\\circ$."
    },
    {
      id: 11,
      question: "Một quạt máy quay 400 vòng/phút. Hỏi trong 1 giây quạt quay được góc bao nhiêu radian?",
      options: ["$\\frac{20\\pi}{3}$", "$\\frac{40\\pi}{3}$", "$10\\pi$", "$20\\pi$"],
      correctAnswerIndex: 1,
      solution: "Số vòng trong 1 giây là $\\frac{400}{60} = \\frac{20}{3}$ vòng. Mỗi vòng là $2\\pi$, do đó góc quay là $\\frac{20}{3} \\cdot 2\\pi = \\frac{40\\pi}{3}$."
    },
    {
      id: 12,
      question: "Cho $\\cot\\alpha = 2$. Tính giá trị của biểu thức $C = \\frac{2\\cos\\alpha + \\sin\\alpha}{\\cos\\alpha - \\sin\\alpha}$.",
      options: ["$4$", "$5$", "$3$", "$-5$"],
      correctAnswerIndex: 1,
      solution: "Chia cả tử và mẫu cho $\\sin\\alpha \\neq 0$, ta có $C = \\frac{2\\cot\\alpha + 1}{\\cot\\alpha - 1} = \\frac{2\\cdot 2 + 1}{2 - 1} = 5$."
    },
    {
      id: 13,
      question: "Tính $A = \\sin^2(25^\\circ) + \\sin^2(65^\\circ)$.",
      options: ["$0$", "$0.5$", "$1$", "$2$"],
      correctAnswerIndex: 2,
      solution: "Vì $25^\\circ + 65^\\circ = 90^\\circ$ nên $\\sin(65^\\circ) = \\cos(25^\\circ)$. $A = \\sin^2(25^\\circ) + \\cos^2(25^\\circ) = 1$."
    },
    {
      id: 14,
      question: "Rút gọn biểu thức $B = \\tan(x) \\cdot \\cot(x) + \\sin^2(x) + \\cos^2(x)$ (khi các giá trị xác định).",
      options: ["$0$", "$1$", "$2$", "$3$"],
      correctAnswerIndex: 2,
      solution: "Ta có $\\tan x \\cdot \\cot x = 1$ và $\\sin^2 x + \\cos^2 x = 1$. Vậy $B = 1 + 1 = 2$."
    },
    {
      id: 15,
      question: "Một quạt trần quay 150 vòng trong 1 phút. Số vòng quay được trong 2 giây là bao nhiêu?",
      options: ["$2$", "$4$", "$5$", "$10$"],
      correctAnswerIndex: 2,
      solution: "Trong 1 giây quạt quay được $\\frac{150}{60} = 2.5$ vòng. Trong 2 giây quạt quay được $2.5 \\cdot 2 = 5$ vòng."
    }
  ],
  // SET 3
  [
    {
      id: 1,
      question: "Góc $72^\\circ$ bằng bao nhiêu radian?",
      options: ["$\\frac{\\pi}{5}$", "$\\frac{2\\pi}{5}$", "$\\frac{3\\pi}{5}$", "$\\frac{4\\pi}{5}$"],
      correctAnswerIndex: 1,
      solution: "$72^\\circ \\cdot \\frac{\\pi}{180^\\circ} = \\frac{2\\pi}{5}$."
    },
    {
      id: 2,
      question: "Cung tròn dài $4\\pi$ cm, góc ở tâm chắn cung là $120^\\circ$. Tính bán kính $R$.",
      options: ["$4$ cm", "$5$ cm", "$6$ cm", "$8$ cm"],
      correctAnswerIndex: 2,
      solution: "$120^\\circ = \\frac{2\\pi}{3}$. Ta có $l = R\\alpha \\Rightarrow R = \\frac{l}{\\alpha} = \\frac{4\\pi}{\\frac{2\\pi}{3}} = 6$ cm."
    },
    {
      id: 3,
      question: "Điểm biểu diễn góc $-\\frac{\\pi}{4}$ nằm ở góc phần tư nào trên đường tròn lượng giác?",
      options: ["I", "II", "III", "IV"],
      correctAnswerIndex: 3,
      solution: "Góc $-\\frac{\\pi}{4}$ quay cùng chiều kim đồng hồ từ tia $Ox$, sẽ rơi vào góc phần tư thứ IV."
    },
    {
      id: 4,
      question: "Khi $-\\frac{\\pi}{2} < \\alpha < 0$, mệnh đề nào đúng?",
      options: ["$\\sin\\alpha > 0, \\cos\\alpha < 0$", "$\\sin\\alpha < 0, \\cos\\alpha > 0$", "$\\sin\\alpha < 0, \\cos\\alpha < 0$", "$\\sin\\alpha > 0, \\cos\\alpha > 0$"],
      correctAnswerIndex: 1,
      solution: "Khoảng $(-\\frac{\\pi}{2}; 0)$ thuộc góc phần tư thứ IV, hoành độ dương ($\\cos > 0$) và tung độ âm ($\\sin < 0$)."
    },
    {
      id: 5,
      question: "Tính $\\tan(135^\\circ)$.",
      options: ["$1$", "$-1$", "$\\sqrt{3}$", "$-\\sqrt{3}$"],
      correctAnswerIndex: 1,
      solution: "$\\tan(135^\\circ) = \\tan(180^\\circ - 45^\\circ) = -\\tan(45^\\circ) = -1$."
    },
    {
      id: 6,
      question: "Cho $\\tan\\alpha = -3$ (với $\\frac{\\pi}{2} < \\alpha < \\pi$). Tính $\\cos\\alpha$.",
      options: ["$\\frac{1}{\\sqrt{10}}$", "$-\\frac{1}{\\sqrt{10}}$", "$\\frac{3}{\\sqrt{10}}$", "$-\\frac{3}{\\sqrt{10}}$"],
      correctAnswerIndex: 1,
      solution: "$\\frac{1}{\\cos^2\\alpha} = 1 + \\tan^2\\alpha = 10 \\Rightarrow \\cos^2\\alpha = \\frac{1}{10}$. Vì $\\frac{\\pi}{2} < \\alpha < \\pi$ nên $\\cos\\alpha < 0 \\Rightarrow \\cos\\alpha = -\\frac{1}{\\sqrt{10}}$."
    },
    {
      id: 7,
      question: "Khẳng định nào sau đây là ĐÚNG?",
      options: ["$\\tan\\alpha \\cdot \\cot\\alpha = 1$", "$\\sin^2\\alpha - \\cos^2\\alpha = 1$", "$1 + \\tan^2\\alpha = \\frac{1}{\\sin^2\\alpha}$", "$1 + \\cot^2\\alpha = \\frac{1}{\\cos^2\\alpha}$"],
      correctAnswerIndex: 0,
      solution: "Tích của tan và cot của cùng một góc (khi xác định) luôn bằng 1."
    },
    {
      id: 8,
      question: "Hai góc bù nhau có tính chất nào sau đây?",
      options: ["$\\tan(\\pi - \\alpha) = \\tan\\alpha$", "$\\tan(\\pi - \\alpha) = -\\tan\\alpha$", "$\\cot(\\pi - \\alpha) = \\cot\\alpha$", "$\\cos(\\pi - \\alpha) = \\cos\\alpha$"],
      correctAnswerIndex: 1,
      solution: "Chỉ có sin của hai góc bù nhau là bằng nhau. Các hàm khác đổi dấu, nên $\\tan(\\pi - \\alpha) = -\\tan\\alpha$."
    },
    {
      id: 9,
      question: "Giá trị của $\\cos(\\alpha + \\pi)$ bằng?",
      options: ["$\\cos\\alpha$", "$\\sin\\alpha$", "$-\\cos\\alpha$", "$-\\sin\\alpha$"],
      correctAnswerIndex: 2,
      solution: "Với hai góc hơn kém nhau $\\pi$, tan và cot giữ nguyên dấu, sin và cos đổi dấu. Vậy $\\cos(\\alpha + \\pi) = -\\cos\\alpha$."
    },
    {
      id: 10,
      question: "Hai góc lượng giác $\\alpha$ và $\\alpha + k2\\pi$ ($k \\in \\mathbb{Z}$) có đặc điểm gì?",
      options: ["Vuông góc", "Đối nhau", "Bù nhau", "Có cùng điểm biểu diễn"],
      correctAnswerIndex: 3,
      solution: "Hai góc sai khác nhau một bội của $2\\pi$ sẽ có cùng một điểm biểu diễn trên đường tròn lượng giác."
    },
    {
      id: 11,
      question: "Một vòng quay của đu quay tương ứng với góc $2\\pi$ rad. Quay $\\frac{1}{4}$ vòng là góc bao nhiêu?",
      options: ["$\\frac{\\pi}{4}$", "$\\frac{\\pi}{2}$", "$\\pi$", "$\\frac{3\\pi}{4}$"],
      correctAnswerIndex: 1,
      solution: "$\\frac{1}{4} \\cdot 2\\pi = \\frac{\\pi}{2}$."
    },
    {
      id: 12,
      question: "Cho $3\\cos\\alpha - \\sin\\alpha = 0$, tính $\\tan\\alpha$.",
      options: ["$\\frac{1}{3}$", "$3$", "$1$", "$-3$"],
      correctAnswerIndex: 1,
      solution: "$3\\cos\\alpha = \\sin\\alpha \\Rightarrow \\frac{\\sin\\alpha}{\\cos\\alpha} = 3 \\Rightarrow \\tan\\alpha = 3$."
    },
    {
      id: 13,
      question: "Tính $C = \\tan(10^\\circ) \\cdot \\tan(80^\\circ)$.",
      options: ["$0$", "$0.5$", "$1$", "$2$"],
      correctAnswerIndex: 2,
      solution: "Vì $10^\\circ$ và $80^\\circ$ phụ nhau nên $\\tan(80^\\circ) = \\cot(10^\\circ)$. Vậy $C = \\tan(10^\\circ) \\cdot \\cot(10^\\circ) = 1$."
    },
    {
      id: 14,
      question: "Cho $\\sin\\alpha = 0.5$. Tính $A = 4\\sin^2\\alpha + 3$.",
      options: ["$1$", "$2$", "$3$", "$4$"],
      correctAnswerIndex: 3,
      solution: "$A = 4(0.5)^2 + 3 = 4 \\cdot 0.25 + 3 = 1 + 3 = 4$."
    },
    {
      id: 15,
      question: "Bánh xe quay được góc $30\\pi$ rad trong 1 phút. Số vòng quay của bánh xe trong 1 phút là bao nhiêu?",
      options: ["$10$", "$15$", "$30$", "$60$"],
      correctAnswerIndex: 1,
      solution: "Mỗi vòng quay tương ứng $2\\pi$ rad. Số vòng là $\\frac{30\\pi}{2\\pi} = 15$ vòng."
    }
  ],
  // SET 4
  [
    {
      id: 1,
      question: "Góc $\\frac{7\\pi}{12}$ radian đổi sang độ là bao nhiêu?",
      options: ["$105^\\circ$", "$120^\\circ$", "$135^\\circ$", "$150^\\circ$"],
      correctAnswerIndex: 0,
      solution: "$\\frac{7\\pi}{12} \\cdot \\frac{180^\\circ}{\\pi} = 105^\\circ$."
    },
    {
      id: 2,
      question: "Đường tròn $R=5$, cung tròn có độ dài $l=10$. Số đo radian của cung tròn là?",
      options: ["$0.5$", "$2$", "$50$", "$2\\pi$"],
      correctAnswerIndex: 1,
      solution: "$\\alpha = \\frac{l}{R} = \\frac{10}{5} = 2$ rad."
    },
    {
      id: 3,
      question: "Điểm biểu diễn góc $\\frac{\\pi}{2}$ nằm ở đâu trên đường tròn lượng giác?",
      options: ["Phần dương trục hoành", "Phần âm trục hoành", "Phần dương trục tung", "Phần âm trục tung"],
      correctAnswerIndex: 2,
      solution: "Góc $\\frac{\\pi}{2}$ (tức $90^\\circ$) nằm ở giao điểm của đường tròn và phần dương của trục tung $Oy$."
    },
    {
      id: 4,
      question: "Giá trị của $\\cot\\frac{5\\pi}{6}$ là bao nhiêu?",
      options: ["$\\sqrt{3}$", "$-\\sqrt{3}$", "$\\frac{1}{\\sqrt{3}}$", "$-\\frac{1}{\\sqrt{3}}$"],
      correctAnswerIndex: 1,
      solution: "$\\cot\\frac{5\\pi}{6} = -\\sqrt{3}$."
    },
    {
      id: 5,
      question: "Tập giá trị của biểu thức $\\cos x$ là?",
      options: ["$[0; 1]$", "$[-1; 0]$", "$[-1; 1]$", "$\\mathbb{R}$"],
      correctAnswerIndex: 2,
      solution: "Với mọi số thực $x$, ta luôn có $-1 \\le \\cos x \\le 1$."
    },
    {
      id: 6,
      question: "Cho $\\cos\\alpha = \\frac{4}{5}$, với $270^\\circ < \\alpha < 360^\\circ$. Tính $\\tan\\alpha$.",
      options: ["$\\frac{3}{4}$", "$-\\frac{3}{4}$", "$\\frac{3}{5}$", "$-\\frac{3}{5}$"],
      correctAnswerIndex: 1,
      solution: "$\\sin^2\\alpha = 1 - \\cos^2\\alpha = \\frac{9}{25}$. Do $270^\\circ < \\alpha < 360^\\circ$ (góc phần tư IV) nên $\\sin\\alpha = -\\frac{3}{5}$. Suy ra $\\tan\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha} = -\\frac{3}{4}$."
    },
    {
      id: 7,
      question: "Rút gọn biểu thức $\\sin^2\\alpha(1 + \\cot^2\\alpha)$.",
      options: ["$\\sin^2\\alpha$", "$\\cos^2\\alpha$", "$1$", "$\\tan^2\\alpha$"],
      correctAnswerIndex: 2,
      solution: "$\\sin^2\\alpha \\cdot \\left(\\frac{1}{\\sin^2\\alpha}\\right) = 1$."
    },
    {
      id: 8,
      question: "Mệnh đề nào sau đây đúng với mọi góc $\\alpha$?",
      options: ["$\\cot(-\\alpha) = \\cot\\alpha$", "$\\cot(-\\alpha) = -\\cot\\alpha$", "$\\tan(-\\alpha) = \\tan\\alpha$", "$\\cos(-\\alpha) = -\\cos\\alpha$"],
      correctAnswerIndex: 1,
      solution: "Hàm côtang là hàm số lẻ nên $\\cot(-\\alpha) = -\\cot\\alpha$."
    },
    {
      id: 9,
      question: "Giá trị của $\\sin(\\alpha + 2024\\pi)$ bằng?",
      options: ["$\\sin\\alpha$", "$-\\sin\\alpha$", "$\\cos\\alpha$", "$-\\cos\\alpha$"],
      correctAnswerIndex: 0,
      solution: "Hàm số $\\sin$ tuần hoàn với chu kì $2\\pi$, do đó $\\sin(\\alpha + k2\\pi) = \\sin\\alpha$. Ở đây $k = 1012$."
    },
    {
      id: 10,
      question: "Trong hệ toạ độ $Oxy$, góc lượng giác có điểm biểu diễn thuộc góc phần tư thứ I có đặc điểm gì?",
      options: ["$\\sin\\alpha > 0, \\cos\\alpha > 0$", "$\\sin\\alpha < 0, \\cos\\alpha > 0$", "$\\sin\\alpha > 0, \\cos\\alpha < 0$", "$\\sin\\alpha < 0, \\cos\\alpha < 0$"],
      correctAnswerIndex: 0,
      solution: "Tại góc phần tư thứ I, cả hoành độ và tung độ đều dương."
    },
    {
      id: 11,
      question: "Cho $\\sin\\alpha + \\cos\\alpha = \\frac{1}{2}$. Tính $\\sin\\alpha\\cos\\alpha$.",
      options: ["$-\\frac{3}{8}$", "$\\frac{3}{8}$", "$-\\frac{3}{4}$", "$\\frac{3}{4}$"],
      correctAnswerIndex: 0,
      solution: "Bình phương hai vế: $(\\sin\\alpha + \\cos\\alpha)^2 = \\frac{1}{4} \\Rightarrow 1 + 2\\sin\\alpha\\cos\\alpha = \\frac{1}{4} \\Rightarrow 2\\sin\\alpha\\cos\\alpha = -\\frac{3}{4} \\Rightarrow \\sin\\alpha\\cos\\alpha = -\\frac{3}{8}$."
    },
    {
      id: 12,
      question: "Rút gọn biểu thức $E = 2(\\sin^2 x + \\cos^2 x) - 1$.",
      options: ["$0$", "$1$", "$2$", "$3$"],
      correctAnswerIndex: 1,
      solution: "$E = 2(1) - 1 = 1$."
    },
    {
      id: 13,
      question: "Tính $D = \\cos(20^\\circ) + \\cos(160^\\circ) + 5$.",
      options: ["$3$", "$4$", "$5$", "$6$"],
      correctAnswerIndex: 2,
      solution: "Vì $20^\\circ$ và $160^\\circ$ bù nhau nên $\\cos(160^\\circ) = -\\cos(20^\\circ)$. Suy ra $\\cos(20^\\circ) + \\cos(160^\\circ) = 0$. Vậy $D = 0 + 5 = 5$."
    },
    {
      id: 14,
      question: "Cho $\\tan\\alpha = 2$. Tính $F = \\frac{\\sin\\alpha + \\cos\\alpha}{\\cos\\alpha}$.",
      options: ["$1$", "$2$", "$3$", "$4$"],
      correctAnswerIndex: 2,
      solution: "$F = \\frac{\\sin\\alpha}{\\cos\\alpha} + \\frac{\\cos\\alpha}{\\cos\\alpha} = \\tan\\alpha + 1 = 2 + 1 = 3$."
    },
    {
      id: 15,
      question: "Kim giây của một đồng hồ dài 15cm. Trong 10 giây kim giây vạch nên một cung có độ dài bao nhiêu? (Lấy kết quả chia cho $\\pi$).",
      options: ["$2$", "$3$", "$4$", "$5$"],
      correctAnswerIndex: 3,
      solution: "Góc quay trong 10s là $\\frac{10}{60} \\cdot 2\\pi = \\frac{\\pi}{3}$. Độ dài cung $l = R\\alpha = 15 \\cdot \\frac{\\pi}{3} = 5\\pi$. Kết quả chia cho $\\pi$ là 5."
    }
  ]
];
