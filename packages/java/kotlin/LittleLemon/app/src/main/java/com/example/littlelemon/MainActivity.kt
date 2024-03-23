package com.example.littlelemon

import android.graphics.Color
import android.os.Bundle
import android.widget.LinearLayout
import android.widget.TextView
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.example.littlelemon.ui.theme.LittleLemonTheme

class MainActivity : ComponentActivity() {

    lateinit var topLayout: LinearLayout
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        topLayout=findViewById(R.id.top_layout)
        topLayout.setBackgroundColor(Color.parseColor("#495E57"))
        var textView = TextView(this)
        textView.text = resources.getText(R.string.little_lemon)
        textView.setTextColor(Color.parseColor("#F4CE14"))
        topLayout.addView(textView)
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
            text = "Hello $name!",
            modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    LittleLemonTheme {
        Greeting("Android")
    }
}