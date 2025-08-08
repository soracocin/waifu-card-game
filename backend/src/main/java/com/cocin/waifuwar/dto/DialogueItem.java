package com.cocin.waifuwar.dto;

public class DialogueItem {
    private String text;
    private Integer orderIndex;

    // Constructors
    public DialogueItem() {}

    public DialogueItem(String text, Integer orderIndex) {
        this.text = text;
        this.orderIndex = orderIndex;
    }

    // Getters and setters
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}
