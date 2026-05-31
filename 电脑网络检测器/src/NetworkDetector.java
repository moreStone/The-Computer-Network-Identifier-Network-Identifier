import javax.swing.*;
import java.awt.*;
import java.net.*;
import java.io.*;

public class NetworkDetector {

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JDialog progressDialog = createProgressDialog();
            progressDialog.setVisible(true);

            SwingWorker<Boolean, Void> worker = new SwingWorker<>() {
                @Override
                protected Boolean doInBackground() {
                    return checkNetwork();
                }

                @Override
                protected void done() {
                    progressDialog.dispose();
                    try {
                        showResult(get());
                    } catch (Exception e) {
                        showResult(false);
                    }
                }
            };
            worker.execute();
        });
    }

    private static JDialog createProgressDialog() {
        JDialog dialog = new JDialog();
        dialog.setTitle("网络检测中...");
        dialog.setSize(340, 130);
        dialog.setLocationRelativeTo(null);
        dialog.setDefaultCloseOperation(JDialog.DO_NOTHING_ON_CLOSE);
        dialog.setResizable(false);
        dialog.setAlwaysOnTop(true);

        JPanel panel = new JPanel(new BorderLayout(15, 15));
        panel.setBorder(BorderFactory.createEmptyBorder(20, 25, 20, 25));

        JLabel label = new JLabel("正在检测网络连接，请稍候...", SwingConstants.CENTER);
        label.setFont(new Font("Microsoft YaHei", Font.PLAIN, 14));

        JProgressBar progressBar = new JProgressBar();
        progressBar.setIndeterminate(true);
        progressBar.setPreferredSize(new Dimension(270, 22));

        panel.add(label, BorderLayout.NORTH);
        panel.add(progressBar, BorderLayout.CENTER);

        dialog.add(panel);
        return dialog;
    }

    private static boolean checkNetwork() {
        sleep(4000);

        String[] hosts = {"www.baidu.com", "www.qq.com", "www.aliyun.com", "www.google.com", "8.8.8.8"};
        for (String host : hosts) {
            try {
                if (InetAddress.getByName(host).isReachable(2500)) return true;
            } catch (IOException ignored) {}
        }

        String[][] tcpTargets = {{"www.baidu.com", "80"}, {"www.baidu.com", "443"}, {"8.8.8.8", "53"}};
        for (String[] t : tcpTargets) {
            try (java.net.Socket s = new java.net.Socket()) {
                s.connect(new InetSocketAddress(t[0], Integer.parseInt(t[1])), 2500);
                return true;
            } catch (IOException ignored) {}
        }

        return false;
    }

    private static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ignored) {}
    }

    private static void showResult(boolean hasNetwork) {
        String title = "网络检测结果";
        String message = hasNetwork ? "有网" : "没网";
        int msgType = hasNetwork ? JOptionPane.INFORMATION_MESSAGE : JOptionPane.ERROR_MESSAGE;

        // 自定义大字体 label
        JLabel label = new JLabel(message, SwingConstants.CENTER);
        label.setFont(new Font("Microsoft YaHei", Font.BOLD, 48));
        if (hasNetwork) {
            label.setForeground(new Color(10, 165, 10));
        } else {
            label.setForeground(new Color(232, 45, 45));
        }

        JOptionPane.showMessageDialog(null, label, title, msgType);
    }
}
