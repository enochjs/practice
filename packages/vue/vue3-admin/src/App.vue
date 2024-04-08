<template>
  <div class="code" ref="codeMirror"></div>
  <div @click="addText('名称')">测试数据</div>
  <div>获取数据</div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { EditorView, minimalSetup, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { MatchDecorator, WidgetType } from "@codemirror/view";
import { PlaceholderWidget } from "./index";
import {
  Decoration,
  DecorationSet,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";

const codeMirror = ref(null);
let doc = `console.log(2222)`;
const addText = () => {
  let val = { name: "测试数据年就开了", id: "222" };
  if (editor) {
    console.log("codeMirror.value.state", editor);

    editor.dispatch({
      changes: {
        from: editor.state.selection.main.head,
        to: editor.state.selection.main.head,
        insert: `[[${val.id}.${val.name}]]`,
      },
      // 光标位置
      selection: {
        anchor:
          editor.state.selection.main.head +
          val.name.length +
          5 +
          val.id.length,
      },
    });
  }
};
let editor;
onMounted(() => {
  const placeholderMatcher = new MatchDecorator({
    // regexp: /\[\[(\w+)\]\]/g, // 原有逻辑
    regexp: /\[\[(.+?)\]\]/g, //支持中文
    decoration: (match) =>
      Decoration.replace({
        widget: new PlaceholderWidget(match[1]),
      }),
  });
  const placeholders = ViewPlugin.fromClass(
    class {
      placeholders: DecorationSet;
      constructor(view: EditorView) {
        this.placeholders = placeholderMatcher.createDeco(view);
      }
      update(update: ViewUpdate) {
        this.placeholders = placeholderMatcher.updateDeco(
          update,
          this.placeholders
        );
      }
    },
    {
      decorations: (instance) => instance.placeholders,
      provide: (plugin) =>
        EditorView.atomicRanges.of((view) => {
          return view.plugin(plugin)?.placeholders || Decoration.none;
        }),
    }
  );

  if (codeMirror.value) {
    const baseTheme = EditorView.baseTheme({
      ".cm-mywidget": {
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingTop: "3px",
        paddingBottom: "3px",
        marginLeft: "3px",
        marginRight: "3px",
        backgroundColor: "#ffcdcc",
        borderRadius: "4px",
      },
    });
    editor = new EditorView({
      state: EditorState.create({
        doc: "Dear [[name]],\nYour [[item]] is on its way. Please see [[order]] for details.\n",
        extensions: [placeholders, baseTheme, basicSetup, javascript()],
      }),
      parent: codeMirror.value,
    });

    // new EditorView({
    //   state: EditorState.create({
    //     doc: "Dear [[name]],\nYour [[item]] is on its way. Please see [[order]] for details.\n",
    //     extensions: [basicSetup, javascript(), [baseTheme, [], placeholders]],
    //   }),
    //   parent: codeMirror.value,
    // });

    // let editor = new EditorView({
    //   parent: codeMirror.value,
    //   doc: "Dear [[name]],\nYour [[item]] is on its way. Please see [[order]] for details.\n",
    //   extensions: [placeholders, baseTheme, basicSetup, javascript()],
    // });
  }
});
</script>

<style scoped>
.code {
  width: 100%;
  height: 300px;
}
.ͼ1 .cm-merge-b .cm-changedLine {
  background: #ddfbe6;
}
.ͼ1 .cm-merge-b .cm-changedText {
  background: #c6efd0;
}
.cm-merge-revert {
  display: none;
}
.cm-merge-a .cm-changedText,
.cm-deletedChunk .cm-deletedText {
  background: #eac3cc;
}
.cm-changeGutter {
  width: 100%;
}
.cm-changeGutter {
  position: absolute;
  left: 0;
  z-index: -1;
}
.cm-merge-b .cm-changedLineGutter {
  background: #ddfbe6;
}
.cm-merge-a .cm-changedLineGutter,
.cm-deletedLineGutter {
  background: #f9d7dc;
}
.cm-merge-a .cm-changedLine,
.cm-deletedChunk {
  background: #fbe9eb;
}
.cm-merge-b .cm-changedLine {
  background: #ecfdf0;
}
.cm-line {
  padding: 2px 2px 0 6px;
  padding-left: 40px;
  position: relative;
  font-size: 12px;
}
.cm-merge-a .cm-changedLine::before {
  content: "-";
  display: inline-block;
  position: absolute;
  left: 10px;
  color: #9bb0a1;
}

.cm-merge-b .cm-changedLine::before {
  content: "+";
  display: inline-block;
  position: absolute;
  left: 10px;
  color: #9bb0a1;
}
.cm-lineNumbers .cm-gutterElement {
  /* padding: 2px 3px 0 5px; */
  color: rgba(0, 0, 0, 0.3);
}
.cm-merge-revert {
  display: none;
}
.cm-gutters {
  padding-left: 30px;
}
.cm-content {
  padding: 0;
}
</style>

